
from flask import Flask, render_template, request, send_file
import openai
from io import BytesIO
from PIL import Image
import base64

class ImageGenerator():
    def __init__(self) -> None:
        openai.api_key_path = "/home/mark/Documents/Hackathon/APIKeyOPENIA.zshrc"
        self.size = "512x512"
        self.n = 1


    def delete_every_second_line(self, content):
        lines = content.splitlines()
        filtered_lines = [line for i, line in enumerate(lines) if i % 2 == 0]
        return '\n'.join(filtered_lines)

    def make_prompt(self, text):
        content = text['content']
        out = self.delete_every_second_line(content)
        prompt = "Can you create an image for a story board using the Scene described here: " + out
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
        print(prompt)
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/1200px-Cute_dog.jpg?20140729055059"