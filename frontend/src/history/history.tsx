
import GlassCard from "../components/glass";
import { useState, useEffect } from 'react';

import type { CSSProperties } from "react";
import { DateRangePickerControlledDemo } from "./calender";

import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "react-aria-components";


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
    historyId: string | null;
    setHistoryId: (historyId: string | null) => void;
};

type HistoryDay = {
    date: string;
    min_c: number | null;
    max_c: number | null;
}

type HistoryRecord = {
    id: string;
    location_id: string;
    name: string
    country: string
    start_date: string;
    end_date: string;
    days: HistoryDay[];
    created_at: string;
}
const now = today(getLocalTimeZone());

export default function History({ selectedLocation, historyId, setHistoryId }: CurrentProps) {
    const [history, setHistory] = useState<HistoryRecord | null>(null);
    const [value, setValue] = useState<{ start: DateValue; end: DateValue } | null>({ start: now.subtract({ days: 7 }), end: now, });

    const addhistory = async (loc: WeatherLocation) => {
        const response = await fetch("http://localhost:8000/api/v1/history/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                location_id: loc.id,
            })

        });
        if (!response.ok) {
            console.error("Failed to create current weather:", response.status);
            return;
        }

        const data: { _id?: string } = await response.json();
        if (!data._id) {
            console.error("Current weather response did not include an ID");
            return;
        }
        setHistoryId(data._id);
    };


    useEffect(() => {
        if (!selectedLocation || !historyId) {
            setHistory(null);
            return;
        }

        const fetchCurForecast = async () => {
            const response = await fetch(
                `http://localhost:8000/api/v1/history/display/${historyId}`
            );
            if (!response.ok) {
                console.error("Failed to fetch weather:", response.status);
                return;
            }

            const data = await response.json();
            setHistory(data);
        };

        fetchCurForecast();

        const interval = setInterval(fetchCurForecast, 100000);

        return () => clearInterval(interval);

    }, [selectedLocation, historyId]);
    return (
        <GlassCard>
            <div className="flex flex-col gap-6 p-6 text-white">

                <form className="flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={(event) => { event.preventDefault();  if (selectedLocation) void addhistory(selectedLocation); }}>
                    <div className="flex-1">
                        <DateRangePickerControlledDemo value={value} setValue={setValue} />
                    </div>

                    <button type="submit" disabled={!selectedLocation || !value} className="rounded-xl bg-white/90 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                        Submit
                    </button>
                </form>

                {history && (
                    <>
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                            

                            <div className="text-right">
                                <p className="text-sm text-white/70">{history.start_date}</p>
                                <p className="text-sm text-white/50">to {history.end_date}</p>
                            </div>
                        </div>

                        <div className="grid max-h-90 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
                            {history.days.map((day) => (
                                <div
                                    key={day.date}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:bg-white/10"
                                >
                                    <p className="text-sm font-medium text-white/60">
                                        {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </p>

                                    <div className="mt-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-2xl font-semibold">
                                                {day.max_c !== null ? `${Math.round(day.max_c)}°` : "--"}
                                            </p>
                                            <p className="text-xs text-white/50">High</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg text-white/60">
                                                {day.min_c !== null ? `${Math.round(day.min_c)}°` : "--"}
                                            </p>
                                            <p className="text-xs text-white/40">Low</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </GlassCard>
    );
}