"use client"

import {Settings} from "lucide-react"
import {useState} from "react";


export default function SettingsComponent() {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <div className="flex h-full w-full">
            <div className="fixed bottom-1 right-1">
                <Settings className="w-12 h-12 cursor-pointer " onClick={() => setShowSettings(true)}/>
            </div>

            {showSettings && (
                <div onClick={() => setShowSettings(false)} className="flex items-center justify-center h-screen w-screen backdrop-blur-lg fixed inset-0">
                    <div onClick={(e) => e.stopPropagation()} className="bg-gray-300 rounded-2xl p-10 min-w-100 min-h-100 flex justify-start items-center flex-col gap-5">
                        <h1 className="text-4xl font-bold">Settings</h1>
                        <button className="px-5 py-3 bg-amber-200 rounded-2xl cursor-pointer hover:bg-amber-100 transition-colors duration-700" >Update Weather Location</button>
                        <div className="flex flex-col items-center">
                            <p>Speech of the Day update intervall in minutes</p>
                            <input type="number" placeholder="60" className="py-3 px-5 border-2 rounded-2xl"/>
                        </div>
                        <div className="flex flex-col items-center">
                            <p>Weather update intervall in minutes</p>
                            <input type="number" placeholder="60" className="py-3 px-5 border-2 rounded-2xl"/>
                        </div>
                        <button className="px-7 py-5 text-lg bg-amber-200 rounded-2xl cursor-pointer hover:bg-amber-100 transition-colors duration-700" >Save changes</button>
                    </div>
                </div>
            )}
        </div>
    )
}