import clsx from 'clsx';
import { TextareaHTMLAttributes } from 'react';

const Textarea = ({
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

    error?: string;
    setValue: (value: string) => void;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div className={clsx('flex flex-col gap-1.5', className)}>
        {/* Label */}
        <span className='text-xs font-medium text-foreground-2 shrink-0 whitespace-nowrap'>
            {label}
        </span>

        {/* Textarea */}
        <div className='flex-1 bg-background-2 border border-border-2 flex'>
            <textarea
                {...props}
                value={value}
                onChange={({ target }) => setValue(target.value)}
                className='w-full min-h-24 max-h-64 resize-y py-2 px-3 bg-transparent border-none outline-none text-xs sm:text-sm font-medium placeholder:text-foreground-3'
            />
        </div>

        {/* Error Message */}
        {error && (
            <span className='text-xs font-medium text-red-1 ml-auto min-w-0 flex-1 text-right'>
                {error}
            </span>
        )}
    </div>
);

export { Textarea };
