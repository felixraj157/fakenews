from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__,static_folder="static")

genai.configure(api_key="AIzaSyAih-_qtidjx7wsywtlOVBHcwf1UqHBgCY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_message = data.get("message", "")
    language = data.get("language", "english")  # Default to English if not set

    # Set prompt based on language
    if language == "tamil":
        prompt = f"""
        இந்த செய்தி உண்மையானதா அல்லது போலியானதா என்பதை பகுப்பாய்வு செய்யவும்.
        முடிவை கூறி அதன் விளக்கத்தைக் கொடுக்கவும்.
        பதிலை கீழே குறிப்பிடப்பட்ட வடிவத்தில் வழங்கவும்:
        
        ✅ Real News: [Explanation] 
        ❌ Fake News: [Explanation]
        
        செய்தி: {user_message}
        """
    else:
        prompt = f"""
        Analyze whether this news is real or fake.
        Clearly state the result and provide an explanation.
        Format the response as follows:
        
        ✅ Real News: [Explanation] 
        ❌ Fake News: [Explanation]
        
        News: {user_message}
        """

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(debug=True)
