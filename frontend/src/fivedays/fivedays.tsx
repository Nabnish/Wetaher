import { CSSProperties } from "react";
import GlassCard from "../components/glass";

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

export default function FiveDays({ selectedLocation, weatherId }: CurrentProps){
    return(
        <>
            <GlassCard>
                
            </GlassCard>
        </>
    );
}