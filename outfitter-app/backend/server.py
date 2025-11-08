from flask import Flask, jsonify, request
import json
from weather import get_current_weather

app = Flask(__name__)

CLOTHING_FILE_PATH = '../src/assets/clothing/clothing.json'

def read_clothing_data():
    with open(CLOTHING_FILE_PATH, 'r') as f:
        return json.load(f)

def write_clothing_data(data):
    with open(CLOTHING_FILE_PATH, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/clothing')
def get_clothing():
    data = read_clothing_data()
    return jsonify(data)

@app.route('/api/wear-items', methods=['POST'])
def wear_items():
    data = request.get_json()
    worn_item_ids = data.get('item_ids', [])

    clothing_data = read_clothing_data()

    # Remove 'recently worn' tag from all items
    for item in clothing_data:
        if 'recently worn' in item['tags']:
            item['tags'].remove('recently worn')

    # Add 'recently worn' tag to the new items
    for item in clothing_data:
        if item['id'] in worn_item_ids:
            if 'recently worn' not in item['tags']:
                item['tags'].append('recently worn')

    write_clothing_data(clothing_data)

    return jsonify({'message': 'Clothing updated successfully'})

@app.route('/api/weather')
def weather():
    weather_data = get_current_weather()
    if weather_data is not None:
        return jsonify(weather_data)
    else:
        return jsonify({'error': 'Could not retrieve weather data'}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
