from flask import Flask, jsonify, request
import json
import uuid
from weather import get_current_weather

app = Flask(__name__)

CLOTHING_FILE_PATH = '../src/assets/clothing/clothing.json'
EVENTS_FILE_PATH = './events.json'

def read_json_file(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def write_json_file(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/events')
def get_events():
    data = read_json_file(EVENTS_FILE_PATH)
    return jsonify(data)

@app.route('/api/event/<event_id>')
def get_event(event_id):
    events = read_json_file(EVENTS_FILE_PATH)
    event = next((event for event in events if event.get('id') == event_id), None)
    if event:
        return jsonify(event)
    return jsonify({'message': 'Event not found'}), 404

@app.route('/api/add-event', methods=['POST'])
def add_event():
    new_event = request.get_json()
    new_event['id'] = str(uuid.uuid4())
    events = read_json_file(EVENTS_FILE_PATH)
    events.append(new_event)
    write_json_file(EVENTS_FILE_PATH, events)
    return jsonify({'message': 'Event added successfully', 'event': new_event})

@app.route('/api/update-event/<event_id>', methods=['PUT'])
def update_event(event_id):
    updated_event = request.get_json()
    events = read_json_file(EVENTS_FILE_PATH)
    for i, event in enumerate(events):
        if event.get('id') == event_id:
            updated_event['id'] = event_id
            events[i] = updated_event
            write_json_file(EVENTS_FILE_PATH, events)
            return jsonify({'message': 'Event updated successfully', 'event': updated_event})
    return jsonify({'message': 'Event not found'}), 404

@app.route('/api/clothing')
def get_clothing():
    data = read_json_file(CLOTHING_FILE_PATH)
    return jsonify(data)

@app.route('/api/wear-items', methods=['POST'])
def wear_items():
    data = request.get_json()
    worn_item_ids = data.get('item_ids', [])

    clothing_data = read_json_file(CLOTHING_FILE_PATH)

    # Remove 'recently worn' tag from all items
    for item in clothing_data:
        if 'recently worn' in item['tags']:
            item['tags'].remove('recently worn')

    # Add 'recently worn' tag to the new items
    for item in clothing_data:
        if item['id'] in worn_item_ids:
            if 'recently worn' not in item['tags']:
                item['tags'].append('recently worn')

    write_json_file(CLOTHING_FILE_PATH, clothing_data)

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
