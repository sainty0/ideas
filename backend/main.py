from flask import Flask, render_template, request, jsonify
import openai
from io import BytesIO
from PIL import Image
import base64
from ImageGenerator import ImageGenerator

app = Flask(__name__)
ImageGenerator = ImageGenerator()

@app.route('/', methods=['GET', 'POST'])
def index():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    try:
        prompt = request.form['prompt']

        #url = ImageGenerator.make_image(prompt)
        url = ImageGenerator.mock_openai_image_create(prompt)

        return jsonify({'image_url': url})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
