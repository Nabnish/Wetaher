
const options = [
  { key: 'Current', text: 'CurrentForecast', value: 'current' },
  { key: 'History', text: 'HistoryForecast', value: 'history' },
  { key: "FiveDays",text: "FiveDaysForecast", value: "fivedays"}
  
]

const InputExampleActionDropdown = () => (
  <div className="text-white mt-10">
    <span aria-hidden='true' className="pr-2 ">⌕</span>
    <input className="pl-2 pr-2"type='search' placeholder='Search...' aria-label='Search' />
    <select className="bg-opacity-0 border rounded-3xl p-1 ml-2" aria-label='Search scope' defaultValue='page'>
      {options.map(({ key, text, value }) => (
        <option className="text-blue-700"key={key} value={value}>
          {text}
        </option>
      ))}
    </select>
  </div>
)

export default InputExampleActionDropdown