from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import httpx
import asyncio
from fastapi import HTTPException

class WeatherInput(BaseModel):
    temperature: float
    humidity: float
    pressure: float
    wind_speed: float
    wind_direction: float
    timestamp: datetime
    location: dict

class WeatherForecast(BaseModel):
    temperature: float
    humidity: float
    precipitation_probability: float
    forecast_time: datetime
    weather_condition: str

class WeatherResponse(BaseModel):
    location: dict
    current_weather: WeatherForecast
    hourly_forecast: List[WeatherForecast]
    daily_forecast: List[WeatherForecast]
    alerts: Optional[List[str]] = None

class WeatherService:
    def __init__(self, streamlit_url: str):
        self.streamlit_url = streamlit_url
        self.client = httpx.AsyncClient(timeout=30.0)

    async def get_weather_forecast(self, weather_input: WeatherInput) -> WeatherResponse:
        try:
            # Make async request to Streamlit-deployed model
            response = await self.client.post(
                f"{self.streamlit_url}/predict",
                json=weather_input.dict()
            )
            response.raise_for_status()
            forecast_data = response.json()

            # Process the response
            return self._process_forecast_data(forecast_data, weather_input.location)
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching forecast from model: {str(e)}"
            )

    def _process_forecast_data(self, forecast_data: dict, location: dict) -> WeatherResponse:
        current_weather = WeatherForecast(
            temperature=forecast_data['current']['temperature'],
            humidity=forecast_data['current']['humidity'],
            precipitation_probability=forecast_data['current']['precipitation_prob'],
            forecast_time=datetime.now(),
            weather_condition=forecast_data['current']['condition']
        )

        hourly_forecast = [
            WeatherForecast(
                temperature=hour['temperature'],
                humidity=hour['humidity'],
                precipitation_probability=hour['precipitation_prob'],
                forecast_time=datetime.fromisoformat(hour['time']),
                weather_condition=hour['condition']
            )
            for hour in forecast_data['hourly']
        ]

        daily_forecast = [
            WeatherForecast(
                temperature=day['temperature'],
                humidity=day['humidity'],
                precipitation_probability=day['precipitation_prob'],
                forecast_time=datetime.fromisoformat(day['time']),
                weather_condition=day['condition']
            )
            for day in forecast_data['daily']
        ]

        # Check for weather alerts
        alerts = self._generate_weather_alerts(current_weather, hourly_forecast)

        return WeatherResponse(
            location=location,
            current_weather=current_weather,
            hourly_forecast=hourly_forecast,
            daily_forecast=daily_forecast,
            alerts=alerts
        )

    def _generate_weather_alerts(
        self, 
        current: WeatherForecast, 
        hourly: List[WeatherForecast]
    ) -> List[str]:
        alerts = []
        
        # Temperature alerts
        if current.temperature > 35:
            alerts.append("High temperature alert: Stay hydrated and avoid prolonged sun exposure")
        elif current.temperature < 0:
            alerts.append("Freezing temperature alert: Risk of ice formation")

        # Precipitation alerts
        next_6_hours = hourly[:6]
        if any(h.precipitation_probability > 0.7 for h in next_6_hours):
            alerts.append("High precipitation probability in next 6 hours")

        # Extreme weather conditions
        if current.weather_condition.lower() in ['storm', 'thunderstorm', 'heavy rain']:
            alerts.append(f"Extreme weather alert: {current.weather_condition}")

        return alerts 