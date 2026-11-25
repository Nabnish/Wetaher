import GlassCard from "../components/glass"
import type { CSSProperties } from "react";

type GlassCardProps = {
    
    className?: string;
    style?: CSSProperties;
};

type WeatherLocation = {
    id: number;
    name: string;
    state: string;
    country: string;
    coordinates: { lat: number; lon: number };
};
type SavedProps = NavProps & GlassCardProps;

type NavProps = {
    location: WeatherLocation[];
    setLocation: (locations: WeatherLocation[]) => void;
    selectedLocation: WeatherLocation | null;
    setSelectedLocation: (location: WeatherLocation) => void;
};

export default function Saved({ location,selectedLocation,setSelectedLocation, className = "",style}: SavedProps){
     const selectLocation = (loc: WeatherLocation) => {
        setSelectedLocation(loc);
    };
    return <>
        <GlassCard className="flex flex-cols">
            <div
            className={`${className}`}
            style={style}
        >
            <div>

             {location.map(location => (
                 <div key={location.id} className="flex flex-row-reverse item-center ">
                                <p>{location.name}</p>
                                <button
                                    aria-pressed={selectedLocation?.id === location.id}
                                    onClick={() => selectLocation(location)}
                                    >select</button>

                            </div>
                ))}
            </div>
                
                </div>
        </GlassCard>
    </>
}