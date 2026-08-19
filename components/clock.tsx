"use client"


import {useEffect, useState} from "react";

export default function ClockComponent() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <p className="text-4xl font-bold">{time.toLocaleTimeString("de-AT")}</p>
            <p className="font-sams">{time.toLocaleDateString()}</p>
        </div>
    )
}


