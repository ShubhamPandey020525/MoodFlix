import os
import pickle
from sklearn.metrics.pairwise import cosine_similarity

# Get absolute paths
MODELS_DIR = r"C:\Users\pande\MoodFlix\src_ai\models"

# OLD
# saved vectors load kar rahe hain
vectors = pickle.load(open(os.path.join(MODELS_DIR, "vectors.pkl"), "rb"))

# OLD
# cosine similarity calculate kar rahe hain
similarity = cosine_similarity(vectors)

# OLD
# similarity matrix save kar rahe hain
pickle.dump(similarity, open(os.path.join(MODELS_DIR, "similarity.pkl"), "wb"))

print(f"Similarity matrix saved in {MODELS_DIR}")