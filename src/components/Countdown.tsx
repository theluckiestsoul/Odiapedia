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
            <div className="p-6 bg-gradient-to-r from-amber-100 to-white border border-amber-200 rounded-xl text-center my-8 shadow-sm">
                <h3 className="text-2xl font-bold text-amber-800 font-display">
                    {labels.expired}
                </h3>
            </div>
        );
    }

    return (
        <div className="my-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <TimeUnit value={timeLeft.days} label={labels.days} />
                <TimeUnit value={timeLeft.hours} label={labels.hours} />
                <TimeUnit value={timeLeft.minutes} label={labels.minutes} />
                <TimeUnit value={timeLeft.seconds} label={labels.seconds} />
            </div>
        </div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center bg-gradient-to-b from-amber-50 to-white border border-amber-200 p-4 rounded-xl shadow-lg shadow-amber-900/5">
            <span className="text-4xl md:text-5xl font-bold text-amber-700 font-display tabular-nums">
                {String(value).padStart(2, "0")}
            </span>
            <span className="text-amber-900/60 text-sm md:text-base uppercase tracking-wider mt-2">
                {label}
            </span>
        </div>
    );
}
