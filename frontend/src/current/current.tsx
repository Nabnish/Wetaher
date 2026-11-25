import GlassCard from "../components/glass";
import { useEffect, useState, type CSSProperties } from "react";
import CurrentWeather from "./weathercur";
type GlassCardProps = {

    className?: string;
    style?: CSSProperties;
};

type WeatherLocation = {
    id: string;
    name: string;
    state: string;
    country: string;
    coordinates: { lat: number; lon: number };
};

type CurrentProps = GlassCardProps & {
    selectedLocation: WeatherLocation | null;
    weatherId: string | null;
};

type CurrentWeather = {
    location: {
        name: string;
        country: string;
    };
    temperature_c: number;
    feels_like_c: number;
    humidity: number;
    pressure?: number;
    wind_speed: number;
};

export default function Current({ selectedLocation, weatherId }: CurrentProps) {
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    useEffect(() => {
        if (!selectedLocation || !weatherId) {
            setCurrent(null);
            return;
        }

        const fetchCurForecast = async () => {
            const response = await fetch(
                `http://localhost:8000/api/v1/current/today/display/${weatherId}`
            );
            if (!response.ok) {
                console.error("Failed to fetch weather:", response.status);
                return;
            }

            const data = await response.json();
            setCurrent(data);
        };

        fetchCurForecast();

        const interval = setInterval(fetchCurForecast, 100000);

        return () => clearInterval(interval);

    }, [selectedLocation, weatherId]);
    return (
        <>
            {current && (
                <GlassCard>
                    <CurrentWeather
                        name={current.location.name}
                        country={current.location.country}
                        temp={current.temperature_c}
                        feels_like={current.feels_like_c}
                        humidity={current.humidity}
                        pressure={current.pressure ?? 0}
                        wind_speed={current.wind_speed}
                    />
                </GlassCard>
            )}
        </>
    );
}