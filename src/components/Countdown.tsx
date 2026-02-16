"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
    targetDate: string;
    labels?: {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
        expired: string;
    };
}

export default function Countdown({
    targetDate,
    labels = {
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        expired: "The event has started!",
    },
}: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    isExpired: false,
                };
            } else {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isExpired: true,
                };
            }
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (timeLeft.isExpired) {
        return (
            <div className="p-6 bg-white border border-zinc-200 rounded-xl text-center my-8 shadow-sm">
                <h3 className="text-2xl font-bold text-zinc-900">
                    {labels.expired}
                </h3>
            </div>
        );
    }

    return (
        <div className="my-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {Object.entries({
                    days: timeLeft.days,
                    hours: timeLeft.hours,
                    minutes: timeLeft.minutes,
                    seconds: timeLeft.seconds,
                }).map(([unit, value]) => (
                    <div key={unit} className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-teal-100 shadow-sm hover:shadow-md transition-all group ring-1 ring-slate-50 hover:ring-teal-100">
                        <div className="text-3xl md:text-4xl font-bold text-teal-700 mb-1 font-mono group-hover:scale-110 transition-transform duration-300">
                            {value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-medium group-hover:text-teal-600">
                            {labels[unit as keyof typeof labels]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
            <span className="text-4xl md:text-5xl font-bold text-orange-600 tabular-nums tracking-tight">
                {String(value).padStart(2, "0")}
            </span>
            <span className="text-zinc-500 text-sm md:text-base uppercase tracking-wider mt-2 font-medium">
                {label}
            </span>
        </div>
    );
}
