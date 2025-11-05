import geocoder
import requests

def get_current_temp_f():
    g = geocoder.ip('me')
    if not g.latlng:
        print("Unable to retrieve your location.")
        return None

    lat, lon = g.latlng
    url = "https://api.open-meteo.com/v1/forecast"
    params = {"latitude": lat, "longitude": lon, "current_weather": True}
    r = requests.get(url, params=params)
    r.raise_for_status()

    c = r.json()["current_weather"]["temperature"]
    f = round((c * 9/5) + 32, 1)
    print(f"Current temperature is {f}°F")
    return f

if __name__ == "__main__":
    get_current_temp_f()
