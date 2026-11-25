import GlassCard from "./components/glass"
import Nav from "./components/nav"
import { useState } from "react";
import Saved from "./savedloc/saved";
import Current from "./current/current";
import FiveDays from "./fivedays/fivedays";
type WeatherLocation = {
    id: string;
    name: string;
    state: string;
    country: string;
    coordinates: { lat: number; lon: number };
};

function App() {

  const [location, setLocation] = useState<WeatherLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);
  const [currentWeatherId, setCurrentWeatherId] = useState<string | null>(null);
  const [fiveDayWeatherId, setFiveDayWeatherId] = useState<string | null>(null);

  return (
    <main className="min-h-dvh w-full">
      <div className="flex min-h-dvh w-full flex-col bg-[url('/img/download.jpg')] bg-cover bg-center">
        <Nav location={location} setLocation={setLocation} selectedLocation={selectedLocation} setSelectedLocation = {setSelectedLocation}/>
        <div className="grid flex-1 grid-cols-2   place-content-center gap-4 pt-40 mx-auto ">

          <Current className="col-span-2" selectedLocation={selectedLocation} currentWeatherId={currentWeatherId}/>
          <GlassCard className=""></GlassCard>
          <FiveDays className="" selectedLocation={selectedLocation} fiveDayWeatherId={fiveDayWeatherId} />
          <Saved className="col-span-2" location={location} setLocation={setLocation} selectedLocation={selectedLocation} setSelectedLocation = {setSelectedLocation} setCurrentWeatherId={setCurrentWeatherId} setFiveDayWeatherId = {setFiveDayWeatherId}/>
          
        </div>
      </div>

    </main>
  )
}

export default App
