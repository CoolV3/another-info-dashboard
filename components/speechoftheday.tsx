"use client"

import speechofday from "@/lib/speechofday.json"
import {useEffect, useState} from "react";


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

export default function SpeedOfDayComponent() {
    const [weather, setWeather] = useState<WeatherResponse["current"] | null>()
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [error, setError] = useState("")
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [speechOfTheDay, setSpeechOfTheDay] = useState("")


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

        const getSpeechOfTheDay = () => {
            const currentSpeech = speechofday[Math.floor(Math.random() * speechofday.length)]
            setSpeechOfTheDay(currentSpeech.speech)
        }

        fetchWeather()
        getSpeechOfTheDay()

        const interval = setInterval(() => {
            fetchWeather()
            getSpeechOfTheDay()
        }, 60 * 60 * 100)

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

  

    return (
        <div>
            <p className="text-2xl font-bold">Speech of the day:</p>
            <p className="text-3xl">{speechOfTheDay}</p>
        </div>
    )
}