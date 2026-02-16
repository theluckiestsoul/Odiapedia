"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export interface TimelineEvent {
    year: string;
    era: string;
    title: string;
    titleOdia?: string;
    description: string;
    category: "prehistoric" | "ancient" | "medieval" | "colonial" | "modern";
    image?: string;
}

interface TimelineViewProps {
    events: TimelineEvent[];
    categoryColors: Record<string, { bg: string; border: string; dot: string; text: string }>;
}

export default function TimelineView({ events, categoryColors }: TimelineViewProps) {
    // Group events by era for sticky headers
    const eventsByEra = events.reduce((acc, event) => {
        if (!acc[event.era]) {
            acc[event.era] = [];
        }
        acc[event.era].push(event);
        return acc;
    }, {} as Record<string, TimelineEvent[]>);

    return (
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
            {/* Center Line - Coastal Style */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-200/0 via-teal-200 to-teal-200/0 transform md:-translate-x-1/2"></div>

            <div className="space-y-24">
                {Object.entries(eventsByEra).map(([era, eraEvents]) => (
                    <div key={era} className="relative">
                        {/* Sticky Era Header - Glassmorphism */}
                        <div className="sticky top-24 z-30 flex justify-center mb-12 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white/90 backdrop-blur-md border border-teal-100 px-6 py-2 rounded-full shadow-lg shadow-teal-900/5 ring-1 ring-teal-50"
                            >
                                <span className="text-teal-900 font-display text-xl tracking-wide font-bold">{era} Era</span>
                            </motion.div>
                        </div>

                        <div className="space-y-16">
                            {eraEvents.map((event, index) => {
                                const colors = categoryColors[event.category];
                                // Calculate global index to ensure consistent zigzag
                                const globalIndex = events.findIndex(e => e === event);
                                const isLeft = globalIndex % 2 === 0;

                                return (
                                    <motion.div
                                        key={`${era}-${index}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className={`relative flex flex-col md:flex-row gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                                    >
                                        {/* Date Marker (Center) */}
                                        <div className="absolute left-8 md:left-1/2 w-4 h-4 transform -translate-x-1/2 mt-6 md:mt-8 z-20 flex items-center justify-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                                className={`w-4 h-4 rounded-full ${colors.dot} ring-4 ring-slate-50 shadow-[0_0_0_4px_rgba(20,184,166,0.1)]`}
                                            ></motion.div>
                                        </div>

                                        {/* Content Card */}
                                        <div className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}>
                                            <div className={`group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 hover:-translate-y-1`}>

                                                {/* Card Top Border Accent */}
                                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.bg}`}></div>

                                                {/* Image if present */}
                                                {event.image && (
                                                    <div className="relative h-48 w-full overflow-hidden border-b border-slate-100">
                                                        <Image
                                                            src={event.image}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                        />
                                                    </div>
                                                )}

                                                <div className="p-6 md:p-8 relative z-20">
                                                    <div className={`flex flex-col ${isLeft ? "md:items-end" : "md:items-start"} gap-1 mb-3`}>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors`}>
                                                            {event.year}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-teal-800 transition-colors font-display">
                                                        {event.title}
                                                    </h3>

                                                    {event.titleOdia && (
                                                        <p className="text-lg text-teal-600 odia-text mb-3 font-medium">
                                                            {event.titleOdia}
                                                        </p>
                                                    )}

                                                    <p className="text-slate-600 leading-relaxed text-base group-hover:text-slate-700">
                                                        {event.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Empty space for the other side */}
                                        <div className="hidden md:block md:w-1/2"></div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
