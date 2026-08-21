"use client";

import {Sun, CloudSun, CloudRain, CloudFog, CloudSnow, CloudLightning, X, CloudDrizzle, LucideIcon} from 'lucide-react';
import {useEffect, useState} from "react";
import {clearInterval, setInterval} from "node:timers";

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
    2: {
        description: "Maninly clear sky",
        icon: CloudSun
    },
    3: {
        description: "Maninly clear sky",
        icon: CloudSun
    },
    61: {
        description: "Light Rain",
        icon: CloudRain
    },
    63: {
        description: "Moderate Rain",
        icon: CloudRain
    },
    66: {
        description: "Freezing Rain",
        icon: CloudRain
    },
    67: {
        description: "Freezing Rain",
        icon: CloudRain
    },
    65: {
        description: "Intensive Rain",
        icon: CloudRain
    },
    45: {
        description: "Foggy",
        icon: CloudFog
    },
    48: {
        description: "Foggy",
        icon: CloudFog
    },
    51: {
        description: "Light drizzle",
        icon: CloudDrizzle
    },
    53: {
        description: "Moderate drizzle",
        icon: CloudDrizzle
    },
    55: {
        description: "Heavy drizzle",
        icon: CloudDrizzle
    },
    56: {
        description: "Freezing drizzle",
        icon: CloudDrizzle
    },
    57: {
        description: "Freezing drizzle",
        icon: CloudDrizzle
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
    77: {
        description: "Snow grain",
        icon: CloudSnow
    },
    80: {
        description: "Slight rain showers",
        icon: CloudRain
    },
    81: {
        description: "Moderate rain showers",
        icon: CloudRain
    },
    82: {
        description: "Violent rain showers",
        icon: CloudRain
    },
    85: {
        description: "Light snow showers",
        icon: CloudSnow
    },
    86: {
        description: "Heavy snow showers",
        icon: CloudSnow
    },
    95: {
        description: "Thunderstorm",
        icon: CloudLightning
    },
    96: {
        description: "Thunderstorm",
        icon: CloudLightning
    },
    99: {
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
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,weather_code`)
            if (!response.ok) {
                setError(`Weather request failed: ${response.status}`);
            }

            const data: WeatherResponse = await response.json();
            setWeather(data.current);
        } catch (e) {
            setError("Fetching weather data failed")
        }
    }


    useEffect(() => {
        function fetchWeather() {
            const savedLocation = localStorage.getItem("weather-location")

            if (!savedLocation) return

            const parsedLocation: Coordinates = JSON.parse(savedLocation);
            fetchWeatherData(parsedLocation)
        }

        const interval = setInterval(fetchWeather, 60 * 60 * 1000)
        return () => clearInterval(interval)

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