import { cities } from "../data/cities";
import WeatherCard from "./WeatherCard";

export default function WeatherList() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cities.map((city) => (
        <WeatherCard
          key={city.name}
          city={city}
        />
      ))}
    </div>
  );
}