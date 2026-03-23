import pandas as pd
import pickle
from sklearn.feature_extraction.text import CountVectorizer

# load dataset
df = pd.read_csv("data/movies_cleaned.csv")

# OLD SYSTEM
# tags column ko numerical vectors me convert kar rahe hain
cv = CountVectorizer(max_features=5000, stop_words="english")
vectors = cv.fit_transform(df["tags"]).toarray()

# OLD
# movies dataframe save kar rahe hain
pickle.dump(df, open("models/movies.pkl", "wb"))

# OLD
# vectors save kar rahe hain
pickle.dump(vectors, open("models/vectors.pkl", "wb"))

# NEW (dynamic vectorization ke liye)
# vectorizer save kar rahe hain taaki baad me new movie ko bhi
# same vocabulary space me vector bana sake
pickle.dump(cv, open("models/vectorizer.pkl", "wb"))

print("Vectors + vectorizer saved successfully")