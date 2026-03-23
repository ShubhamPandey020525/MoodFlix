import pickle
from sklearn.metrics.pairwise import cosine_similarity

# OLD
# saved vectors load kar rahe hain
vectors = pickle.load(open("models/vectors.pkl", "rb"))

# OLD
# cosine similarity calculate kar rahe hain
similarity = cosine_similarity(vectors)

# OLD
# similarity matrix save kar rahe hain
pickle.dump(similarity, open("models/similarity.pkl", "wb"))

print("Similarity matrix saved")