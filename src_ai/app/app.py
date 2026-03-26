import sys
import os

# Add src to path so we can import llm_recommender
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from llm_recommender import chat_with_moodflix

def main():
    print("="*40)
    print("   Welcome to MoodFlix AI Chat   ")
    print("="*40)
    print("Tell me what kind of movie you're in the mood for!")
    print("(Type 'exit' to quit)\n")
    
    while True:
        try:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "bye"]:
                print("\nMoodFlix: Happy watching! Goodbye.")
                break
                
            print("\nMoodFlix: Thinking... (Consulting Grok and Models)")
            response = chat_with_moodflix(user_input)
            print(f"\nMoodFlix: {response}")
            print("-" * 40)
            
        except KeyboardInterrupt:
            print("\nMoodFlix: Goodbye!")
            break
        except Exception as e:
            print(f"\nMoodFlix Error: {e}")

if __name__ == "__main__":
    main()
