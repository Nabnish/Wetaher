import type { CSSProperties } from "react";
import GlassCard from "../components/glass";
import { useState, useEffect } from "react";
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
    fiveDayWeatherId: string | null;
};

type DailyForecast = {
    date: string;
    weekday: string;
    condition: string;
    high: number;
    low: number;
};

type FiveDayForecast = {
    id: string;
    location_id: string;
    location: {
        name: string;
        country: string;
        coordinates: {
            lat: number;
            lon: number;
        };
    };
    days: DailyForecast[];
    created_at: string;
};


export default function FiveDays({ selectedLocation, fiveDayWeatherId }: CurrentProps) {
    const [five, setFive] = useState<FiveDayForecast | null>(null);
    useEffect(() => {
        if (!selectedLocation || !fiveDayWeatherId) {
            setFive(null);
            return;
        }

        const fetchFiveForecast = async () => {
            const response = await fetch(
                `http://localhost:8000/api/v1/5day/display/${fiveDayWeatherId}`
            );
            if (!response.ok) {
                console.error("Failed to fetch weather:", response.status);
                return;
            }

            const data = await response.json();
            setFive(data);
        };

        fetchFiveForecast();

        const interval = setInterval(fetchFiveForecast, 100000);

        return () => clearInterval(interval);

    }, [selectedLocation, fiveDayWeatherId]);
    return (
        <>
            <GlassCard className=" overflow-hidden p-2">
                <h6 className="p-2">Next Five Days</h6>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {five?.days.map((day) => (
                        <GlassCard key={day.date} className="flex min-w-20 flex-col items-center gap-3 pt-3 pb-4 ">
                            
                            <p className="text-sm font-medium">
                                {day.weekday}
                            </p>


                            <div className="flex flex-col items-center">
                                <p className="text-xl font-medium">
                                    {Math.round(day.high-273.15)}°
                                </p>
                                <p className="text-sm text-white/50">
                                    {Math.round(day.low-273.15)}°
                                </p>
                                <p className="text-sm">
                                    {day.condition}
                                </p>
                            </div>
                        </GlassCard>  
                    ))}
                </div>
            </GlassCard>
        </>
    );
}