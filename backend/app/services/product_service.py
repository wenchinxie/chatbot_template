import pandas as pd
from app.api.models import Product

async def get_initial_products():
    # Read data from Excel file
    df = pd.read_excel('app/data/travel_products.xlsx')
    
    # Convert DataFrame to list of Product objects
    products = [
        Product(
            id=row['id'],
            title=row['title'],
            brief=row['brief'],
            imageUrl=row['imageUrl'],
            link=row['link']
        ) for _, row in df.iterrows()
    ]
    
    return products[:5]  # Return first 5 products as initial products