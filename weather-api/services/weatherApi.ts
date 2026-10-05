export async function getWeather(
  latitude: number,
  longitude: number
) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`
  );

  if (!response.ok) {
    throw new Error("Error");
  }

  const data = await response.json();

  return data.current;
}