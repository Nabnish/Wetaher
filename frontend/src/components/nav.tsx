import { useEffect, useState } from "react";
import InputExampleActionDropdown from "./searchbox.tsx";
export default function Nav(){

    const [location,setLocation] = useState<{
        id: number;
        name: string;
        state: string;
        country: string;
        coordinates: { lat: number; lon: number };
    }[]>([]);
    useEffect(() => {
    const fetchLocations = async () => {
        const response = await fetch(
            "http://localhost:8000/api/v1/location/display"
        );

        const data = await response.json();
        setLocation(data);
    };

    fetchLocations();

    const interval = setInterval(fetchLocations, 2000);

    return () => clearInterval(interval);

}, []);

    return(
        <>
            <div className="bg-opacity-0 border-b-4 border-white absolute min-h-24 h-14 min-w-full  ">
                <div className="flex flex-row mt-auto justify-center items-center">
                    <InputExampleActionDropdown />
                    <div className="flex flex-row items-center bg-opacity-0">
                        {location.map(location => (
                            <div key={location.id} className="flex flex-row ">
                                <p>{location.name}</p>
                                <p>{location.state}</p>
                                <p>{location.country}</p>
                                <p>{location.coordinates.lat}</p>
                                <p>{location.coordinates.lon}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                
            </div>
        </>
    );
}