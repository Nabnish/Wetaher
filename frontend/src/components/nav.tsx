import { useEffect } from "react";
import InputExampleActionDropdown from "./searchbox.tsx";
import { ListItem, ListIcon, ListContent } from 'semantic-ui-react'
type WeatherLocation = {
    id: string;
    name: string;
    state: string;
    country: string;
    coordinates: { lat: number; lon: number };
};


type NavProps = {
    location: WeatherLocation[];
    setLocation: (locations: WeatherLocation[]) => void;
    selectedLocation: WeatherLocation | null;
    setSelectedLocation: (location: WeatherLocation) => void;
};

export default function Nav({ setLocation, selectedLocation }: NavProps) {



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

    return (
        <>
            <div className="absolute z-10 min-h-24 w-full border-b-4 border-white bg-opacity-0">
                <div className="grid min-h-24 w-full grid-cols-[1fr_auto_1fr] items-center px-6">
                    <div/>
                    <InputExampleActionDropdown />
                    <div className="justify-self-end bg-opacity-0 text-right text-white">
                        {selectedLocation && (
                            <div className="flex flex-row justify-end gap-6">
                                <ListItem>
                                    <div className="flex flex-row justify-end">

                                    <ListIcon name='map marker' />
                                    <ListContent>{selectedLocation.name},  {selectedLocation.country}</ListContent>
                                    </div>
                                    <ListContent>{selectedLocation.coordinates.lat},  {selectedLocation.coordinates.lon}</ListContent>
                                </ListItem>
                                {/* <p>City : </p>
                                <p>State : {selectedLocation.state}</p>
                                <p>Country :</p>
                                <p>Latitude : {selectedLocation.coordinates.lat}</p>
                                <p>Longitude : {selectedLocation.coordinates.lon}</p> */}
                            </div>
                        )}

                    </div>
                </div>


            </div>
        </>
    );
}