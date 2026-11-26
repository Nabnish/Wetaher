import { useState } from "react"


const InputExampleActionDropdown = () => {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const addLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    const cityPattern = /^[\p{L}\p{M} .'-]+$/u;

    if (!cityPattern.test(city.trim())) {
      setError("Please enter a valid city name");
      return;
    }
    const response = await fetch("http://localhost:8000/api/v1/location/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: city,
      })

    });
    if(response.status === 404){
      setError("Enter a valid City Name");
    }
    const data = await response.json();
    console.log(data)

  }

  return (
    <div className="text-white mt-10">
      <form onSubmit={addLocation}>

        <span aria-hidden='true' className="pr-2 ">⌕</span>
        <input className="pl-2 pr-2" type='search' placeholder='Enter City...' onChange={(e) => setCity(e.target.value)} value={city} aria-label='Search' />
        <button className="rounded-2xl p-1 ml-2 " type="submit" onChange={(e) => { setCity(e.target.value); setError(""); }}>Enter</button>
        {error && (
          <p className="text-red-400 text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  )
};

export default InputExampleActionDropdown