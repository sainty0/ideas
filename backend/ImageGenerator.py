
from flask import Flask, render_template, request, send_file
import openai
from io import BytesIO
from PIL import Image
import base64

class ImageGenerator():
    def __init__(self) -> None:
        #client = openai()
        self.size = "512x512"
        self.n = 1


    def make_image(self, prompt):
        response = openai.Image.create(
            prompt=prompt,
            n=self.n,
            size=self.size
        )

        image_url = response['data'][0]['url']

        return image_url
    

    def mock_openai_image_create(self, prompt):
        
        img = Image.new('RGB', (512, 512), color = (73, 109, 137))
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return {
            'data': [{'url': 'data:image/png;base64,' + img_str}]
        }