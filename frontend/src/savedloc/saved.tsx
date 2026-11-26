import GlassCard from "../components/glass"
import type { CSSProperties } from "react";

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
type SavedProps = NavProps & GlassCardProps & {
    setCurrentWeatherId: (currentweatherId: string | null) => void;
    currentWeatherId: string | null;
    fiveDayWeatherId: string | null;
    historyId: string | null;
    setHistoryId: (historyId: string | null) => void;
    setFiveDayWeatherId: (fiveDayWeatherId: string | null) => void;

};

type NavProps = {
    location: WeatherLocation[];
    setLocation: (locations: WeatherLocation[]) => void;
    selectedLocation: WeatherLocation | null;
    setSelectedLocation: (location: WeatherLocation | null) => void;
};

export default function Saved({ location, selectedLocation, setSelectedLocation, className = "", style, setCurrentWeatherId, setFiveDayWeatherId, setHistoryId, historyId, currentWeatherId, fiveDayWeatherId }: SavedProps) {
    const selectLocation = (loc: WeatherLocation) => {
        setSelectedLocation(loc);
    };
    const addforecast = async (loc: WeatherLocation) => {
        const response = await fetch("http://localhost:8000/api/v1/current/today/insert", {
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
        setCurrentWeatherId(data._id);

    }

    const addfivedays = async (loc: WeatherLocation) => {
        const response = await fetch("http://localhost:8000/api/v1/5day/insert", {
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

        const data: { id?: string } = await response.json();

        if (!data.id) {
            console.error("Five-day forecast response did not include an ID");
            return;
        }

        setFiveDayWeatherId(data.id);


    }
    const deletelocation = async (id: string) => {
        const response = await fetch(
            `http://localhost:8000/api/v1/location/delete/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Failed to delete history:", error.detail);
            return;
        }

        const data = await response.json();
        console.log(data.message);

        setSelectedLocation(null);



    };
    const deleteCurrent = async (id: string) => {
        const response = await fetch(
            `http://localhost:8000/api/v1/current/today/delete/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Failed to delete history:", error.detail);
            return;
        }

        const data = await response.json();
        console.log(data.message);

        setCurrentWeatherId(null);

    };
    const deleteFiveday = async (id: string) => {
        const response = await fetch(
            `http://localhost:8000/api/v1/current/today/delete/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Failed to delete history:", error.detail);
            return;
        }

        const data = await response.json();
        console.log(data.message);

        setCurrentWeatherId(null);

    };
    const deleteHistory = async (id: string) => {
        const response = await fetch(
            `http://localhost:8000/api/v1/history/delete/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Failed to delete history:", error.detail);
            return;
        }

        const data = await response.json();
        console.log(data.message);


        setHistoryId(null);
    };

    return (<>
        <GlassCard className="flex flex-col  max-h-60 overflow-auto p-4 ">
            <div className={`${className} w-full`} style={style}>
                <div className="flex flex-col gap-3 overflow-auto ">
                    <h6 className="">Recently Searched --{">"}</h6>
                    {location.map((loc) => (
                        <div key={loc.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10">
                            <div className="flex flex-col">
                                <p className="font-medium text-white">
                                    {loc.name}
                                </p>
                                <span className="text-sm text-white/60">
                                    {loc.state}, {loc.country}
                                </span>
                            </div>
                            <div className="flex flex-row">
                                <button aria-pressed={selectedLocation?.id === loc.id} onClick={() => { selectLocation(loc); addforecast(loc); addfivedays(loc) }} className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25 active:scale-95">
                                    Select
                                </button>
                                <button className="rounded-lg bg-red/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25 active:scale-95" onClick={() => { deletelocation(loc.id); if (currentWeatherId) deleteCurrent(currentWeatherId); if (fiveDayWeatherId) deleteFiveday(fiveDayWeatherId); if(historyId) deleteHistory(historyId) }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    </>
    );
}