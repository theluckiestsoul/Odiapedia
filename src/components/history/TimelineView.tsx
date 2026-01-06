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
            {/* Center Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-900/0 via-amber-700/50 to-amber-900/0 transform md:-translate-x-1/2"></div>

            <div className="space-y-24">
                {Object.entries(eventsByEra).map(([era, eraEvents], eraIndex) => (
                    <div key={era} className="relative">
                        {/* Sticky Era Header */}
                        <div className="sticky top-24 z-30 flex justify-center mb-12 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-black/80 backdrop-blur-md border border-amber-500/30 px-6 py-2 rounded-full shadow-2xl shadow-amber-900/20"
                            >
                                <span className="text-amber-100 font-display text-xl tracking-wide">{era} Era</span>
                            </motion.div>
                        </div>

                        <div className="space-y-16">
                            {eraEvents.map((event, index) => {
                                const colors = categoryColors[event.category];
                                const isEven = index % 2 === 0; // Relative to this group, but maybe we want global alternating?
                                // Let's find global index for alternating
                                const globalIndex = events.findIndex(e => e === event);
                                const isLeft = globalIndex % 2 === 0;

                                return (
                                    <motion.div
                                        key={`${era}-${index}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className={`relative flex flex-col md:flex-row gap-8 ${isLeft ? "" : "md:flex-row-reverse"}`}
                                    >
                                        {/* Date Marker (Center) */}
                                        <div className="absolute left-8 md:left-1/2 w-4 h-4 transform -translate-x-1/2 mt-6 md:mt-8 z-20 flex items-center justify-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                                className={`w-4 h-4 rounded-full ${colors.dot} ring-4 ring-black shadow-[0_0_15px_rgba(251,191,36,0.5)]`}
                                            ></motion.div>
                                        </div>

                                        {/* Content Card */}
                                        <div className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}>
                                            <div className={`group relative bg-zinc-900/40 backdrop-blur-sm border ${colors.border} rounded-2xl overflow-hidden hover:bg-zinc-900/60 transition-colors duration-500`}>

                                                {/* Image if present */}
                                                {event.image && (
                                                    <div className="relative h-48 w-full overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10"></div>
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
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/50 border border-white/10 ${colors.text}`}>
                                                            {event.year}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-amber-50 mb-1 group-hover:text-amber-400 transition-colors">
                                                        {event.title}
                                                    </h3>

                                                    {event.titleOdia && (
                                                        <p className="text-lg text-amber-500/80 odia-text mb-3">
                                                            {event.titleOdia}
                                                        </p>
                                                    )}

                                                    <p className="text-zinc-400 leading-relaxed text-base">
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
