from flask import Flask, request, jsonify
import easyocr
import cv2
import numpy as np

app = Flask(__name__)
reader = easyocr.Reader(['en'])

@app.route('/recognize', methods=['POST'])
def recognize_plate():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    image_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

    results = reader.readtext(image)
    
    if results:
        plate_number = results[0][1]
        return jsonify({'plate_number': plate_number})
    else:
        return jsonify({'error': 'No text detected'}), 400

if __name__ == '__main__':
    app.run(port=5000)
