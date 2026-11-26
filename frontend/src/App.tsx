import Nav from "./components/nav"
import { useState } from "react";
import Saved from "./savedloc/saved";
import Current from "./current/current";
import FiveDays from "./fivedays/fivedays";
import History from "./history/history";
import Export from "./export/export";
import Info from "./components/info";
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
  const [historyId, setHistoryId] = useState<string | null>(null);
  const handleSelectLocation = (next: WeatherLocation | null) => {
    if (next?.id !== selectedLocation?.id) {
      setCurrentWeatherId(null);
      setFiveDayWeatherId(null);
      setHistoryId(null);
    }
    setSelectedLocation(next);
  };
  return (
    <main className="min-h-dvh w-full">
      <div className="flex min-h-dvh w-full flex-col bg-[url('/img/download.jpg')] bg-cover bg-center">
        <Nav location={location} setLocation={setLocation} selectedLocation={selectedLocation} setSelectedLocation = {handleSelectLocation}/>
        <Export currentWeatherId={currentWeatherId} historyId={historyId} fiveDayWeatherId={fiveDayWeatherId}/>
        <div className="grid flex-1 grid-cols-2   place-content-center gap-4 pt-30 mx-auto ">

          <Current className="col-span-2" selectedLocation={selectedLocation} currentWeatherId={currentWeatherId}/>
          <History className="col-span-2"  selectedLocation={selectedLocation} historyId={historyId} setHistoryId={setHistoryId} />
          <FiveDays className="" selectedLocation={selectedLocation} fiveDayWeatherId={fiveDayWeatherId} />
          <Saved className="col-span-2" historyId={historyId} setHistoryId={setHistoryId} location={location} setLocation={setLocation} selectedLocation={selectedLocation} fiveDayWeatherId={fiveDayWeatherId} setSelectedLocation = {handleSelectLocation} setCurrentWeatherId={setCurrentWeatherId} currentWeatherId = {currentWeatherId} setFiveDayWeatherId = {setFiveDayWeatherId}/>
          
        </div>
      </div>
        <Info/>

    </main>
  )
}

export default App
