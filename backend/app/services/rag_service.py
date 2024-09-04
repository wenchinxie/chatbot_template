import os
import pandas as pd
import numpy as np
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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
        documents = [row.to_string() for _, row in df.iterrows()]
        
        # Create index
        index = SimpleVectorIndex(documents)
        
        # Save index to disk (just save the documents, we'll recreate the index on load)
        os.makedirs(PERSIST_DIR, exist_ok=True)
        pd.Series(documents).to_pickle(os.path.join(PERSIST_DIR, 'documents.pkl'))
    else:
        # Load documents from disk and recreate index
        documents = pd.read_pickle(os.path.join(PERSIST_DIR, 'documents.pkl')).tolist()
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