"use client";

import { GithubIcon } from "lucide-react";

export default function AppBar() {
    return (
        <div className="bg-transparent backdrop:blur-2xl rounded-4xl m-4 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-purple-600">FileCord</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <button
                                className="p-[3px] relative"
                                onClick={() => window.open('https://github.com/r-mayyank/filecord', '_blank')}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                                <div className="flex items-center px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                                    <GithubIcon className="w-5 h-5 mr-2 "/>
                                    Github
                                </div>
                            </button>
                        </li>  </ul>
                </nav>
            </div>
        </div>
    );
}