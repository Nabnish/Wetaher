import GlassCard from "./components/glass"
import Nav from "./components/nav"
import { useState } from "react";
import Saved from "./savedloc/saved";
type WeatherLocation = {
    id: number;
    name: string;
    state: string;
    country: string;
    coordinates: { lat: number; lon: number };
};

function App() {

  const [location, setLocation] = useState<WeatherLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);

  return (
    <main className="min-h-dvh w-full">
      <div className="flex min-h-dvh w-full flex-col bg-[url('/img/download.jpg')] bg-cover bg-center">
        <Nav location={location} setLocation={setLocation} selectedLocation={selectedLocation} setSelectedLocation = {setSelectedLocation}/>
        <div className="grid flex-1 grid-cols-3   place-content-center gap-4  mx-auto ">

          <GlassCard className="col-span-2 ">
          </GlassCard>
          <GlassCard className=""></GlassCard>
          <GlassCard className=""></GlassCard>
          <Saved className="col-span-2" location={location} setLocation={setLocation} selectedLocation={selectedLocation} setSelectedLocation = {setSelectedLocation}/>
          
        </div>
      </div>

    </main>
  )
}

export default App
