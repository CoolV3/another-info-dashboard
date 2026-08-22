"use client"

import speechofday from "@/lib/speechofday.json"
import {useEffect, useState} from "react";
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

export default function SpeedOfDayComponent() {
    const [weather, setWeather] = useState<WeatherResponse["current"] | null>()
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [error, setError] = useState("")
    const [speechOfTheDay, setSpeechOfTheDay] = useState("")
    const {getWeather} = useWeather()


    useEffect(() => {
            const updateSpeechNow = async () => {
                const response = await getWeather()
                if (response?.success) {
                    const weather = response.weather

                    const matchingSpeech = speechofday.filter((entry) => {
                        const matches = Number(entry.weatherConditionCode) == Number(weather?.current.weather_code) || entry.weatherConditionCode == ""
                        return matches
                    })
                    if (matchingSpeech.length == 0) {
                        setSpeechOfTheDay("No speech found")
                        return
                    }

                    const randomSpeech = matchingSpeech[Math.floor(Math.random() * matchingSpeech.length)]
                    setSpeechOfTheDay(randomSpeech.speech)
                } else {
                    setError(response?.message || "Error while fetching the speech of the day")
                }
            }
            updateSpeechNow()
    }, [])



  

    return (
        <div>
            <p className="text-2xl font-bold">Speech of the day:</p>
            <p className="text-3xl max-w-150">{speechOfTheDay}</p>
        </div>
    )
}