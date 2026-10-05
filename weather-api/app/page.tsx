import WeatherList from "../components/WeatherList";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] p-5 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Weather App
        </h1>

        <p className="mt-2 mb-8 text-gray-400">
          Current weather in different cities
        </p>

        <WeatherList />
      </div>
    </main>
  );
}