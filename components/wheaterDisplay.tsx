"use client";

import {Sun, CloudSun, CloudRain, CloudFog, CloudSnow, CloudLightning, X, CloudDrizzle, LucideIcon} from 'lucide-react';
import {useEffect, useState} from "react";
import {clearInterval, setInterval} from "node:timers";
import useWeather from "@/lib/useWeather";


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
    const {getWeather, updateWeatherLocation, weatherCodes} = useWeather()


    useEffect(() => {
        async function fetchWeather() {
            const response = await getWeather()
            if (response?.success) {
                setWeather(response.weather?.current)
            } else {
                setError(response?.message || "Error while fetching weather data.")
            }
        }
        fetchWeather()

        const interval = setInterval(() => {
            fetchWeather()
            updateWeatherLocation()
        }, 60 * 60 * 1000)

        return () => clearInterval(interval)

    }, [])


    if (!weather) {
        return (
            <div>
                {coordinates != null ? (
                    <p>Loading weather data</p>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <p>{error}</p>
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