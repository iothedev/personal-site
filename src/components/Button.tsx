import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

const Primary = ({
    children,
    className,
    disabled,

    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        disabled={disabled}
        className={clsx(
            'bg-foreground-1 py-2.5 px-3 flex items-center justify-center',
            disabled
                ? 'opacity-80 cursor-not-allowed'
                : 'cursor-pointer hover:opacity-90',
            className,
        )}
    >
        <span className='text-xs sm:text-sm font-medium text-background-1'>
            {children}
        </span>
    </button>
);

const Button = { Primary };

export { Button };
