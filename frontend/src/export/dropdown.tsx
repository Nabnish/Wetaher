
export default function DropDown({ selectedExport, setSelectedExport, }: { selectedExport: string; setSelectedExport: (value: string) => void; }) {


  return (
     <label className="flex flex-col gap-2 text-sm font-medium text-white justify-end ">


      
 
      <select
        value={selectedExport}
        onChange={(e) => setSelectedExport(e.target.value)}
        className="w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none backdrop-blur-md transition hover:bg-white/20 focus:border-white/50 focus:ring-2 focus:ring-white/20"
      >
        <option className="bg-slate-500" value="current">Current Forecast</option>
        <option className="bg-slate-500" value="fiveday">Next 5 days forecast</option>
        <option className="bg-slate-500" value="history">Past forecast</option>
      </select>
    </label>
  );
}