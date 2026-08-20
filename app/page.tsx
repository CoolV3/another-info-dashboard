"use client"

import ClockComponent from "@/components/clock";
import SpeedOfDayComponent from "@/components/speechoftheday";
import WeatherDisplay from "@/components/wheaterDisplay";

export default function Home() {
  return (
    <div className="flex flex-col gap-30 flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ClockComponent/>
        <SpeedOfDayComponent/>
        <WeatherDisplay/>
    </div>
  );
}
