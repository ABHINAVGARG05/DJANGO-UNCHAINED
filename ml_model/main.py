from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.weather_model import WeatherInput, WeatherResponse
from services.weather_service import WeatherService
from config import Settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load settings
settings = Settings()

app = FastAPI(
    title="Weather Forecast API",
    description="API for weather forecasting using ML model deployed on Streamlit",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize weather service
weather_service = WeatherService(settings.streamlit_model_url)

@app.post("/api/weather/forecast", response_model=WeatherResponse)
async def get_weather_forecast(weather_input: WeatherInput):
    """
    Get weather forecast based on current weather conditions
    """
    try:
        logger.info(f"Receiving forecast request for location: {weather_input.location}")
        forecast = await weather_service.get_weather_forecast(weather_input)
        return forecast
    except Exception as e:
        logger.error(f"Error processing forecast request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/weather/forecast/{location_id}")
async def get_location_forecast(location_id: str):
    """
    Get weather forecast for a specific location
    """
    try:
        # Get location details from database or cache
        location = await get_location_details(location_id)
        
        # Create weather input from location data
        weather_input = WeatherInput(
            temperature=location['current_temperature'],
            humidity=location['current_humidity'],
            pressure=location['current_pressure'],
            wind_speed=location['current_wind_speed'],
            wind_direction=location['current_wind_direction'],
            timestamp=datetime.now(),
            location=location
        )
        
        forecast = await weather_service.get_weather_forecast(weather_input)
        return forecast
    except Exception as e:
        logger.error(f"Error getting forecast for location {location_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"} 