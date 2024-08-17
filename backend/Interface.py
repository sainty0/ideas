from flask import Flask, render_template, request, send_file
import openai
from io import BytesIO
from PIL import Image
import base64
from ImageGenerator import ImageGenerator

app = Flask(__name__)
ImageGenerator = ImageGenerator()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        prompt = request.form['prompt']

        #url = ImageGenerator.make_image(prompt)
        response = ImageGenerator.mock_openai_image_create(prompt)

        #image = openai.api_request("GET", url)
        image = response['data'][0]['url'].split(",")[1]
        
        data = BytesIO(image.content)

        return send_file(data, mimetype='image/png')
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
