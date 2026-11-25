import { useState } from "react"


const InputExampleActionDropdown = () => {
  const [city, setCity] = useState("");

  const addLocation = async () => {
    const response = await fetch("http://localhost:8000/api/v1/location/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: city,
      })

    });
    const data = await response.json();
    console.log(data)

  }

  return (
    <div className="text-white">
      <form onSubmit={addLocation}>

        <span aria-hidden='true' className="pr-2 ">⌕</span>
        <input className="pl-2 pr-2" type='search' placeholder='Enter City...' onChange={(e) => setCity(e.target.value)} value={city} aria-label='Search' />
        <button className="rounded-2xl p-1 ml-2 " type="submit">Enter</button>
      </form>
    </div>
  )
};

export default InputExampleActionDropdown