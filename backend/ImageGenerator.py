
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


    def make_prompt(self, text):
        prompt = "Can you create an image for a story board using the Scene described here: " + text
        return prompt


    def make_image(self, text):
        prompt = self.make_prompt(text)
        response = openai.Image.create(
            prompt=prompt,
            n=self.n,
            size=self.size
        )

        image_url = response['data'][0]['url']

        return image_url
    

    def mock_openai_image_create(self, prompt):
        
        return "https://i.pinimg.com/564x/ed/6f/c2/ed6fc28d25da28c73e45ed762a26bbd3.jpg"