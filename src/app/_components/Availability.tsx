import { useMemo } from 'react';

const Availability = () => {
    const quarter = useMemo(() => {
        const month = new Date().getMonth();
        const quarterNumber = Math.floor(month / 3) + 1;

        return `Q${quarterNumber}`;
    }, []);

    return (
        <div className='w-fit py-2 px-3 bg-background-2 border border-border-2 flex items-center gap-2.5'>
            {/* Live */}
            <div className='size-1 rounded-full bg-green-2 shrink-0' />

            {/* Timezone */}
            <span className='text-xs font-medium text-foreground-2 uppercase'>
                Available for{' '}
                <span className='text-foreground-1'>{quarter}</span>
            </span>
        </div>
    );
};

export { Availability };
