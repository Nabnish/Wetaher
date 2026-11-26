# Weather App

A weather app built for the PM Accelerator technical assessment. Users search for a city, see the current weather and a five-day forecast, and request temperature history for a date range. Saved records can be exported as JSON.

Built by Muhammad Nabeel Sheik Pasha.

## Tech Stack

Backend: Python, FastAPI, MongoDB (Motor), httpx, Docker

Frontend: React, TypeScript, Vite, Tailwind CSS, React Aria

External APIs: OpenWeather (geocoding, current weather, five-day forecast), Open-Meteo (historical archive)

## Project Structure

    backend/
      app/
        main.py          App setup, CORS, database connection, routers
        routes/          Location, current weather, five-day, history, export, and API helpers
        services/        Pydantic response models
      Dockerfile
      docker-compose.yaml
      requirements.txt

    frontend/
      src/
        App.tsx          Main layout and shared state
        components/      Nav, search box, glass card, date picker, info section
        current/         Current weather card
        fivedays/        Five-day forecast card
        history/         History card and date range picker
        savedloc/        Saved locations list

## Backend Setup

1. Create a file named `.env` inside the `backend` folder with these values:

       MONGODB_USERNAME=your_username
       MONGODB_PASSWORD=your_password
       MONGODB_URI=your_mongodb_connection_string
       WEATHER_API_KEY=your_openweather_api_key

   

2. Start the backend from the `backend` folder:

       docker compose up --build

3. The API runs at http://localhost:8000. Interactive API docs are at http://localhost:8000/docs.

4. Create the unique index on locations. In MongoDB Compass, open the location collection and add a compound unique index on the latitude and longitude fields. This stops the same place from being saved twice.

## Frontend Setup

1. Install Node.js (version 18 or newer).

2. Install pnpm if you don't have it:

       npm install -g pnpm

3. From the `frontend` folder, run:

       pnpm install
       pnpm dev

4. Open http://localhost:5173 in your browser.

The frontend expects the backend at http://localhost:8000. The backend allows requests from http://localhost:5173

## How to Use the App

1. Search for a city in the search box and select a result. The location is saved to the database.
2. The current weather card shows the weather for the selected location. Click the create button to save a new current weather record.
3. The five-day forecast card shows one entry per day with the high and low temperature. Click the create button to save a new forecast.
4. The history card shows daily high and low temperatures for a date range you choose. Click Submit to save the history record.
5. Each card has an Export button. It downloads the saved record as a JSON file.
6. The saved locations list shows every location you have searched for. You can select or delete a location from it.

## API Endpoints

Location

- POST /api/v1/location/insert: Search for and save a location
- GET /api/v1/location/display: List saved locations
- GET /api/v1/location/display/{city}: Get a saved location by name
- DELETE /api/v1/location/delete/{city}: Delete a saved location
- PUT /api/v1/location/update: Update a saved location

Current weather

- POST /api/v1/current/today/insert: Create a current weather record
- GET /api/v1/current/today/display: List records
- GET /api/v1/current/today/display/{weather_id}: Get one record
- DELETE /api/v1/current/today/delete/{weather_id}: Delete one record

Five-day forecast

- POST /api/v1/5day/insert: Create a five-day forecast record
- GET /api/v1/5day/display: List records
- GET /api/v1/5day/display/{weather_id}: Get one record
- DELETE /api/v1/5day/delete/{weather_id}: Delete one record

History

- POST /api/v1/history/insert: Create a history record for a date range
- GET /api/v1/history/display: List records
- GET /api/v1/history/display/{weather_id}: Get one record
- DELETE /api/v1/history/delete/{weather_id}: Delete one record

Export

- GET /api/v1/export/currentforecast/{record_id}: Download a current weather record as JSON
- GET /api/v1/export/5dayforecast/{record_id}: Download a five-day record as JSON
- GET /api/v1/export/history/{record_id}: Download a history record as JSON

## Design Decisions

Data sources. OpenWeather provides current weather and the five-day forecast, which cover today and the next five days. Open-Meteo provides past temperatures. Historical data is only available for past dates, so a history request is rejected if its end date is in the future.

Data lag. The Open-Meteo archive usually trails real time by a few days. Recent days in a history record may have no temperature values.

Saved records. Each create request saves a new record, so the same location can have many records for different dates. Each record stores the location details along with the weather data. Records are not overwritten.

Unique locations. Locations are unique by coordinates. Saving a place that already exists is blocked by the database index.

Editable data. Location details can be updated. Weather values cannot be edited, because they come from the external APIs and would no longer match their source if changed by hand.

Export. The export endpoints return JSON only.

## Not Implemented

- Google Maps and YouTube integration
- Export in CSV, XML, Markdown, or PDF