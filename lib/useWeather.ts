import {CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, LucideIcon, Sun} from "lucide-react";

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

export default function useWeather() {
    async function getWeather() {
        const savedLocation = localStorage.getItem("weather-location")

        if (!savedLocation) {
            updateWeatherLocation()
        }
        const savedLocation2 = localStorage.getItem("weather-location")

        const parsedLocation: Coordinates = JSON.parse(savedLocation || savedLocation2 || "")

        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${parsedLocation.latitude}&longitude=${parsedLocation.longitude}&current=temperature_2m,apparent_temperature,weather_code`)
            if (!response.ok) {
                return {success: false, message: `Weather request failed: ${response.status}`, weather: null}
            }


            const data: WeatherResponse = await response.json();
            return {success: true, message: `Successfully fetched weather data`, weather: data}
        } catch (e) {
            return {success: false, message: `Weather request failed`, weather: null}
        }
    }

    function updateWeatherLocation() {

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
                return {success: true, message: "Successfully updated weather location."}
            },

            (locationError) => {
                return {success: false, message: "Location permission was not granted"}
            }
        )
    }

    return { getWeather, updateWeatherLocation, weatherCodes }

}

