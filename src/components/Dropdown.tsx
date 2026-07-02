'use client';

import Icons from '@/icons';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const Dropdown = ({
    className,
    label,

    value,
    onChange,

    options,
    error,
}: {
    className?: string;
    label: string;

    value: string;
    onChange: (value: string) => void;

    options: {
        label: string;
        value: string;
    }[];
    error?: string;
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const rootRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = useMemo(
        () => options.find((option) => option.value === value) ?? options[0],
        [options, value],
    );

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (rootRef.current?.contains(event.target as Node)) return;

            setIsOpen(false);
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    useEffect(() => {
        if (!value && options.length > 0) {
            onChange(options[0].value);
        }
    }, [options, value, onChange]);

    return (
        <div className={clsx('flex flex-col gap-1.5', className)}>
            {/* Label */}
            <span className='text-xs font-medium text-foreground-2 shrink-0 whitespace-nowrap'>
                {label}
            </span>

            {/* Dropdown */}
            <div ref={rootRef} className='relative'>
                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen((wasOpen) => !wasOpen)}
                    className='w-full py-2 px-3 bg-background-2 border border-border-2 flex items-center justify-between cursor-pointer hover:opacity-80'
                >
                    <span className='text-xs sm:text-sm font-medium text-foreground-1'>
                        {selectedOption?.label}
                    </span>

                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Icons.ChevronDown className='w-3 text-foreground-3' />
                    </motion.div>
                </button>

                {/* Dropdown Content */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.99 }}
                            transition={{ duration: 0.15 }}
                            className='absolute z-50 mt-1.5 w-full bg-background-2 border border-border-2 overflow-hidden divide-y divide-border-2'
                        >
                            {/* DropDown Items */}
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className='group w-full text-left px-3 py-2 cursor-pointer'
                                >
                                    <span
                                        className={clsx(
                                            'text-xs sm:text-sm font-medium duration-75 group-hover:text-foreground-1',
                                            option.value === value
                                                ? 'text-foreground-1'
                                                : 'text-foreground-2',
                                        )}
                                    >
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error Message */}
            {error && (
                <span className='text-xs font-medium text-red-1 ml-auto min-w-0 flex-1 text-right'>
                    {error}
                </span>
            )}
        </div>
    );
};

export { Dropdown };
