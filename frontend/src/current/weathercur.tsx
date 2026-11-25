
import GlassCard from "../components/glass";

type WeatherProps = {
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
};

export default function CurrentWeather({
  name,
  country,
  temp,
  feels_like,
  humidity,
  pressure,
  wind_speed
}: WeatherProps) {

  const toCelsius = (kelvin: number) =>
    Math.round(kelvin );

  return (
    <GlassCard className="w-full max-w-md p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {name}, {country}
          </h2>
          <p className="text-sm opacity-60">
            Current weather
          </p>
        </div>

        <span className="text-4xl"></span>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <h1 className="text-6xl font-bold">
          {toCelsius(temp)}°
        </h1>

        <div>
          <p className="text-lg">Current conditions</p>
          <p className="text-sm opacity-60">
            Feels like {toCelsius(feels_like)}°C
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8 border-t border-white/20 pt-5">

        <div>
          <p className="text-sm opacity-60">Humidity</p>
          <p className="text-lg font-semibold">{humidity}%</p>
        </div>

        <div>
          <p className="text-sm opacity-60">Wind</p>
          <p className="text-lg font-semibold">{wind_speed} m/s</p>
        </div>

        <div>
          <p className="text-sm opacity-60">Pressure</p>
          <p className="text-lg font-semibold">{pressure} hPa</p>
        </div>

      </div>
    </GlassCard>
  );
}
