# script.py

def generate_response(user_message):
    return "Bonjour! Merci pour votre message."

if __name__ == "__main__":
    user_message = input("Entrez votre message : ")
    response = generate_response(user_message)
    print(response)
