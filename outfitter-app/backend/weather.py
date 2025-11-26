import geocoder
import requests

def get_current_weather():
    g = geocoder.ip('me')
    if not g.latlng:
        print("Unable to retrieve your location.")
        return None

    lat, lon = g.latlng
    url = "https://api.open-meteo.com/v1/forecast"
    params = {"latitude": lat, "longitude": lon, "current_weather": True}
    r = requests.get(url, params=params)
    r.raise_for_status()

    data = r.json()["current_weather"]
    celsius = data["temperature"]
    fahrenheit = round((celsius * 9/5) + 32, 0)
    code = data.get("weathercode", 0)

    # Simplified categories
    if code in [0, 1]:
        condition = "Sunny ☀️"
    elif code in [2, 3, 45, 48]:
        condition = "Cloudy ☁️"
    elif code in [51, 53, 55, 61, 63, 65, 80, 81]:
        condition = "Rainy 🌧️"
    elif code in [71, 73, 75]:
        condition = "Snowy ❄️"
    else:
        condition = "Unknown 🌍"

    print(f"Current temperature: {fahrenheit}°F — {condition}")
    return fahrenheit, condition

if __name__ == "__main__":
    get_current_weather()