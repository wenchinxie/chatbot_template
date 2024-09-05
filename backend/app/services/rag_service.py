import os
import pandas as pd
import numpy as np
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from config import settings
import re
import pickle

def clean_data_to_dict(data):
    # Split the data by entries using a regular expression that matches a newline followed by an "id" (start of a new entry)
    entries = re.split(r'(?<=})\s*(?=id)', data)

    cleaned_entries = []

    for entry in entries:
        # Remove leading/trailing whitespace
        entry = entry.strip()

        # Split the entry by newline characters
        lines = entry.split('\n')

        # Initialize a dictionary for each entry
        entry_dict = {}

        # Process each line in the entry
        for line in lines:
            # Split by the first occurrence of whitespace to separate the key and value
            key_value = re.split(r'\s{2,}', line.strip(), maxsplit=1)
            if len(key_value) == 2:
                key, value = key_value
                entry_dict[key.strip()] = value.strip()
        
        if entry_dict:  # Only add non-empty dictionaries
            cleaned_entries.append(entry_dict)

    return cleaned_entries
genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Path to your Excel file
EXCEL_FILE = 'app/data/data.xlsx'
# Path to save the index
PERSIST_DIR = 'app/data/index_storage'

class SimpleVectorIndex:
    def __init__(self, documents):
        self.documents = documents
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = self.vectorizer.fit_transform(documents)

    def query(self, query_text, top_k=5):
        query_vector = self.vectorizer.transform([query_text])
        similarities = cosine_similarity(query_vector, self.tfidf_matrix)[0]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [(self.documents[i], similarities[i]) for i in top_indices]

def create_or_load_index():
    if not os.path.exists(PERSIST_DIR):
        # Read Excel file
        df = pd.read_excel(EXCEL_FILE)
        
        # Convert DataFrame to list of strings
        documents = [row.to_string(index=False) for _, row in df.iterrows()]
        
        # Create index
        index = SimpleVectorIndex(documents)
        
        # Save index to disk using pickle
        os.makedirs(PERSIST_DIR, exist_ok=True)
        with open(os.path.join(PERSIST_DIR, 'documents.pkl'), 'wb') as f:
            pickle.dump(documents, f)
    else:
        # Load documents from disk using pickle and recreate index
        with open(os.path.join(PERSIST_DIR, 'documents.pkl'), 'rb') as f:
            documents = pickle.load(f)
        index = SimpleVectorIndex(documents)
    
    return index

# Initialize the index
index = create_or_load_index()

async def get_rag_response(query: str) -> str:
    results = index.query(query)
    # For simplicity, we'll just return the top result
    if results:
        return f"Top result: {results[0][0]}\nSimilarity: {results[0][1]:.2f}"
    else:
        return "No relevant results found."

async def refresh_index():
    global index
    # Remove existing index
    if os.path.exists(PERSIST_DIR):
        for file in os.listdir(PERSIST_DIR):
            os.remove(os.path.join(PERSIST_DIR, file))
        os.rmdir(PERSIST_DIR)
    # Recreate index
    index = create_or_load_index()
    return {"message": "Index refreshed successfully"}

def travel_chat(message: str):
    # Retrieve relevant documents
    results = index.query(message, top_k=3)  # Get top 3 relevant documents
    return results # [clean_data_to_dict(doc) for doc, _ in results]
    # Prepare context from retrieved documents
    context = "\n".join([doc for doc, _ in results])
    
    # Prepare prompt with context and user message
    prompt = f"""Context information:
{context}

User message: {message}

Please provide a response based on the context information and the user's message. 
After your response, on a new line, write either "INCLUDE_PRODUCTS" or "NO_PRODUCTS" 
depending on whether you think product recommendations are relevant to this conversation."""

    # Generate response using the model
    response = model.generate_content(prompt)
    
    # Split the response into the actual reply and the product decision
    full_response = response.text.strip().split('\n')
    reply = '\n'.join(full_response[:-1])
    product_decision = full_response[-1]

    products = []
    if product_decision.strip().upper() == "INCLUDE_PRODUCTS":
        # Extract product names from the context (assuming they're in the first column)
        products = results
    
    return {
        "reply": reply,
        "products": products
    }
