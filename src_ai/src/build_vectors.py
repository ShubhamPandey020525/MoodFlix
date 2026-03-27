import os
import pandas as pd
import pickle
from sklearn.feature_extraction.text import CountVectorizer

# Get absolute paths
DATA_FILE = r"C:\Users\pande\MoodFlix\src_ai\data\movies_cleaned.csv"
MODELS_DIR = r"C:\Users\pande\MoodFlix\src_ai\models"

# Create models directory if it doesn't exist
os.makedirs(MODELS_DIR, exist_ok=True)

# load dataset
print(f"Loading dataset from {DATA_FILE}...")
df = pd.read_csv(DATA_FILE)

# OLD SYSTEM
# tags column ko numerical vectors me convert kar rahe hain
cv = CountVectorizer(max_features=5000, stop_words="english")
vectors = cv.fit_transform(df["tags"]).toarray()

# OLD
# movies dataframe save kar rahe hain
pickle.dump(df, open(os.path.join(MODELS_DIR, "movies.pkl"), "wb"))

# OLD
# vectors save kar rahe hain
pickle.dump(vectors, open(os.path.join(MODELS_DIR, "vectors.pkl"), "wb"))

# NEW (dynamic vectorization ke liye)
# vectorizer save kar rahe hain taaki baad me new movie ko bhi
# same vocabulary space me vector bana sake
pickle.dump(cv, open(os.path.join(MODELS_DIR, "vectorizer.pkl"), "wb"))

print(f"Vectors + vectorizer saved successfully in {MODELS_DIR}")