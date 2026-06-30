'use client';

import moment from 'moment';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import type { Contribution } from '@/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;

const LEVEL_COLORS = [
    'bg-background-3',

    'bg-green-1',
    'bg-green-2',
    'bg-green-3',
    'bg-green-4',
] as const;

const ContributionGraph = () => {
    const [contributions, setContributions] = useState<Contribution[] | null>(
        null,
    );
    const [hoveredDay, setHoveredDay] = useState<Contribution | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const weeks = useMemo(() => {
        if (!contributions || contributions.length === 0) {
            return [];
        }

        const contributionByDate = new Map(
            contributions.map((contribution) => [
                contribution.date,
                contribution,
            ]),
        );

        const start = new Date(contributions[0].date);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - start.getDay());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalDays =
            Math.round((today.getTime() - start.getTime()) / MS_PER_DAY) + 1;

        const allDaysInRange: Contribution[] = Array.from(
            { length: totalDays },
            (_, dayOffset) => {
                const currentDate = new Date(start);
                currentDate.setDate(currentDate.getDate() + dayOffset);

                const dateKey = currentDate.toLocaleDateString('en-CA');

                return (
                    contributionByDate.get(dateKey) ?? {
                        date: dateKey,
                        level: 0,
                        count: 0,
                    }
                );
            },
        );

        const weekCount = Math.ceil(allDaysInRange.length / DAYS_PER_WEEK);

        return Array.from({ length: weekCount }, (_, weekIndex) =>
            allDaysInRange.slice(
                weekIndex * DAYS_PER_WEEK,
                weekIndex * DAYS_PER_WEEK + DAYS_PER_WEEK,
            ),
        );
    }, [contributions]);

    useEffect(() => {
        fetch('/api/contributions')
            .then((response) => response.json())
            .then((response) => setContributions(response.contributions));
    }, []);

    if (!weeks.length) {
        return (
            <span className='block mx-auto text-center text-xs font-medium text-foreground-3 animate-pulse'>
                Loading contribution graph...
            </span>
        );
    }

    return (
        <div className='flex flex-col'>
            {/* Graph */}
            <div className='flex gap-0.5 justify-end overflow-hidden'>
                {weeks.map((week, index) => (
                    <div key={index} className='flex flex-col gap-0.5'>
                        {/* Blob */}
                        {week.map(({ date, level, count }) => (
                            <div
                                key={date}
                                className={clsx(
                                    'w-2.5 h-2.5 duration-75 hover:scale-125',
                                    LEVEL_COLORS[level],
                                )}
                                onMouseEnter={(event) => {
                                    const { top, left, width } =
                                        event.currentTarget.getBoundingClientRect();

                                    setTooltipPosition({
                                        x: left + width / 2,
                                        y: top,
                                    });
                                    setHoveredDay({ date, level, count });
                                }}
                                onMouseLeave={() => setHoveredDay(null)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Description */}
            <span className='mt-1.5 ml-auto text-right text-xs font-medium text-foreground-3'>
                Custom-built GitHub contribution graph.
            </span>

            {/* ToolTip */}
            {createPortal(
                <AnimatePresence>
                    {hoveredDay && (
                        <motion.div
                            key={hoveredDay.date}
                            initial={{ opacity: 0, scale: 0.92, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 4 }}
                            transition={{ duration: 0.12, ease: 'easeOut' }}
                            className='fixed -translate-x-1/2 -translate-y-full bg-background-2 py-1.5 px-2 border border-border-2 pointer-events-none flex flex-col'
                            style={{
                                top: tooltipPosition.y,
                                left: tooltipPosition.x,
                            }}
                        >
                            <span className='text-[10px] font-medium text-foreground-2 whitespace-nowrap'>
                                {moment(hoveredDay.date).format(
                                    'dddd, MMM D, YYYY',
                                )}
                            </span>

                            <span className='text-xs font-medium whitespace-nowrap'>
                                {hoveredDay.count} Commits
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </div>
    );
};
export { ContributionGraph };
