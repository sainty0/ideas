
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
        content = text['content']
        result = []
        special_chars = {
            '\n': '\\x0a',  # Hexadecimal for newline
            '\r': '\\x0d',  # Hexadecimal for carriage return
            # Add other special characters if needed
        }

        for char in content:
            if char in special_chars:
                result.append(special_chars[char])
            else:
                result.append(char)

        ''.join(result)
        print(result)
        prompt = "Can you create an image for a story board using the Scene described here: "
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
    

    def mock_openai_image_create(self, text):
        prompt = self.make_prompt(text)
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/1200px-Cute_dog.jpg?20140729055059"