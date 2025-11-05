from flask import Flask, jsonify
from weather import get_current_weather

app = Flask(__name__)

@app.route('/api/weather')
def weather():
    weather_data = get_current_weather()
    if weather_data is not None:
        return jsonify(weather_data)
    else:
        return jsonify({'error': 'Could not retrieve weather data'}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
