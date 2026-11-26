import DropDown from "./dropdown";
import { useState } from "react";

type idprops = {
    currentWeatherId: string | null;
    fiveDayWeatherId: string | null;
    historyId: string | null;
}
export default function Export({ currentWeatherId, historyId, fiveDayWeatherId }: idprops) {
    const [selectedExport, setSelectedExport] = useState('current');
    const exportWeather = async (selectedExport: string) => {


        const endpoints: Record<string, string> = {
            current: "currentforecast",
            fiveday: "5dayforecast",
            history: "history",
        };
        const ids: Record<string, string | null> = {
            current: currentWeatherId,
            fiveday: fiveDayWeatherId,
            history: historyId,
        }

        const endpoint = endpoints[selectedExport];
        const id = ids[selectedExport];
        if (!endpoint || !id) {
            console.error("Select an export type with an available record");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/export/${endpoint}/${id}`
            );

            if (!response.ok) {
                const error = await response.json();
                console.error(error.detail);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedExport}_weather.json`;
            link.click();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export failed:", error);
        }
    };
    return (
        <>
                <div className="flex flex-row-reverse">

            <div className="text-white absolute top-30 flex flex-col   gap-3 p-4 pt-0 ">
                <button onClick={() => exportWeather(selectedExport)} type="button" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95">
                    Export
                </button>
                <DropDown selectedExport={selectedExport} setSelectedExport={setSelectedExport}/>
            </div>
                </div>
        </>
    );
}