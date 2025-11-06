# OutfitterApp

This is a simple app that suggests clothing outfits based on user input.

## Running the Frontend

1. Navigate to the `outfitter-app` directory:
   ```bash
   cd outfitter-app
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Running the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd outfitter-app/backend
   ```
2. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   Depending on your python version, you may need to run pip3 instead:
   ```bash
   pip3 install -r requirements.txt
   ```
3. Start the backend server:
   ```bash
   python server.py
   ```
   Depending on your python version, you may need to run python3 instead:
   ```bash
   python3 server.py
   ```

### Both the backend and the frontend need to be running for the app to work properly!

**Notes:**
- Frontend is located in the `outfitter-app/src`folder
    -  Assets folder: Contains all image and vector files for the app. Clothing items are stored in `assets/clothing`. `clothing.json` contains json mapping of clothing images with clothing name and tags
    - Components folder: Contains reusable components like the navigation bar
    - Pages folder: Contains all pages of the app with their respective CSS files
- Backend is located in the `outfitter-app/backend` folder. **Make sure to install all requirements in requirements.txt before running the backend**