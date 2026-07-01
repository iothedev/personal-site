import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

const Input = ({
    className,
    label,

    value,
    setValue,

    error,

    ...props
}: {
    className?: string;
    label: string;

    value: string;
    setValue: (value: string) => void;

    error?: string;
} & InputHTMLAttributes<HTMLInputElement>) => (
    <div className={clsx('flex flex-col gap-1.5', className)}>
        <div className='flex items-start gap-2 w-full min-w-0'>
            {/* Label */}
            <span className='text-xs font-medium text-foreground-2 shrink-0 whitespace-nowrap'>
                {label}
            </span>

            {/* Error Message */}
            {error && (
                <span className='text-xs font-medium text-red-1 ml-auto min-w-0 flex-1 text-right'>
                    {error}
                </span>
            )}
        </div>

        {/* Input */}
        <div className='flex-1 bg-background-2 border border-border-2 flex items-center gap-2.5'>
            <input
                {...props}
                value={value}
                onChange={({ target }) => setValue(target.value)}
                className='w-full py-2 px-3 bg-transparent border-none outline-none text-xs sm:text-sm font-medium placeholder:text-foreground-3'
            />
        </div>
    </div>
);

export { Input };
