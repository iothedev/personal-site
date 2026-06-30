'use client';

import { useEffect, useState } from 'react';

const Timezone = () => {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const formatted = new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Europe/London',
            }).format(now);

            setTime(formatted);
        };

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!time) {
        return null;
    }

    return (
        <div className='ml-auto py-2 px-3 bg-background-2 border border-border-2 flex items-center gap-2.5'>
            {/* Time */}
            <span className='text-xs font-medium w-[46px] text-right'>
                {time}
            </span>

            {/* Divider */}
            <div className='size-[2.5px] rounded-full bg-border-1' />

            {/* Timezone */}
            <span className='text-xs font-medium text-foreground-2 uppercase'>
                GMT
            </span>
        </div>
    );
};

export { Timezone };
