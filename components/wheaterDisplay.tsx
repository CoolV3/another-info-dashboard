"use client";

import {Sun, CloudSun, CloudRain, CloudFog, CloudSnow, CloudLightning, X, LucideIcon} from 'lucide-react';
import {useEffect, useState} from "react";

const weatherCodes:Record<number, {
    description: string,
    icon: LucideIcon
}> = {
    0: {
        description: "Clear Sky",
        icon: Sun
    },
    1: {
        description: "Maninly clear sky",
        icon: CloudSun
    },
    65: {
        description: "Raining",
        icon: CloudRain
    },
    45: {
        description: "Foggy",
        icon: CloudFog
    },
    71: {
        description: "Light snowfall",
        icon: CloudSnow
    },
    73: {
        description: "Moderate snowfall",
        icon: CloudSnow
    },
    75: {
        description: "Heavy snowfall",
        icon: CloudSnow
    },
    95: {
        description: "Thunderstorm",
        icon: CloudLightning
    }
}

type WeatherResponse = {
    current: {
        temperature_2m: number,
        apparent_temperature: number,
        weather_code: number
    }
}

type Coordinates = {
    latitude: number;
    longitude: number;
};

export default function WeatherDisplay() {
    const [weather, setWeather] = useState<WeatherResponse["current"] | null>()
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [error, setError] = useState("")
    const [loadingLocation, setLoadingLocation] = useState(false)

    const fetchWeatherData = async (location: Coordinates) => {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,weather_code`)

        if (!response.ok) {
            throw new Error(`Weather request failed: ${response.status}`);
        }

        const data: WeatherResponse = await response.json();
        setWeather(data.current);
    }

    useEffect(() => {
        function fetchWeather() {
            const savedLocation = localStorage.getItem("weather-location")

            if (!savedLocation) return

            const parsedLocation: Coordinates = JSON.parse(savedLocation);
            fetchWeatherData(parsedLocation)
        }

        fetchWeather()
    }, [])


    const requestLocation = () => {
        setLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const location: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }

                localStorage.setItem(
                    "weather-location",
                    JSON.stringify(location)
                )

                setCoordinates(location)
                setLoadingLocation(false)
                fetchWeatherData(location)
            },
            (locationError) => {
                setError("Location permission was not granted")
                setLoadingLocation(false)
            }
        )
    }

    if (!weather) {
        return (
            <div>
                {coordinates != null ? (
                    <p>Loading weather data</p>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <button className="px-5 py-3 bg-amber-200 rounded-2xl cursor-pointer hover:bg-amber-100 transition-colors duration-700" disabled={loadingLocation} onClick={requestLocation}>Use my location</button>
                        <p>We need your location data to fetch the weather for your region.</p>
                    </div>
                )}
            </div>
        )
    }

    const weatherInfo = weatherCodes[weather.weather_code] ?? {
        description: "Unknown weather",
        icon: X,
    };

    const WeatherIcon = weatherInfo.icon;

    return (
        <div>
            <div>
                <div className="flex items-center justify-center gap-5">
                    <h1 className="text-6xl">{weather.temperature_2m}°C</h1>
                    <div className="flex flex-col items-center justify-center">
                        <WeatherIcon className="w-10 h-10"/>
                        <p className="text-lg font-bold">{weatherInfo.description}</p>
                        {error != "" && (<p className="text-lg text-red">{error}</p>)}
                    </div>
                </div>
            </div>
        </div>
    )
}