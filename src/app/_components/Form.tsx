'use client';

import clsx from 'clsx';
import { useState, useCallback } from 'react';

import { Input, Textarea, Dropdown } from '@/components';

import type { RawValidationError, ValidationErrors } from '@/types';

const Form = () => {
    const [name, setName] = useState<string>('');
    const [contact, setContact] = useState<string>('');
    const [budget, setBudget] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const [validationErrors, setValidationErrors] =
        useState<null | ValidationErrors>(null);

    const submitForm = useCallback(() => {
        setValidationErrors(null);
        setIsLoading(true);

        fetch(`/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, contact, budget, description }),
        })
            .then((res) => res.json())
            .then(({ success, error }) => {
                if (!success) {
                    const formattedErrors = Object.fromEntries(
                        error.map((issue: RawValidationError) => [
                            issue.path[0],
                            issue.message,
                        ]),
                    );

                    return setValidationErrors(formattedErrors);
                }

                setIsSubmitted(true);
                setValidationErrors(null);
            })
            .finally(() => setIsLoading(false));
    }, [name, contact, budget, description]);

    if (isSubmitted) {
        return (
            <div className='mt-6 w-full border-t border-border-2 pt-6'>
                <div className='w-full max-w-116 mx-auto flex flex-col text-center'>
                    {/* Wave */}
                    <img
                        src='/wave.png'
                        className='size-8 mx-auto select-none pointer-events-none'
                    />

                    {/* Title */}
                    <span className='mt-2.5 text-base sm:text-lg font-medium'>
                        Thank you for reaching out!
                    </span>

                    {/* Description */}
                    <span className='mt-0.5 text-xs sm:text-sm text-foreground-2 font-medium'>
                        I'll contact you soon, usually within a few hours. If
                        your any details are incorrect,{' '}
                        <button
                            className='underline cursor-pointer'
                            onClick={() => setIsSubmitted(false)}
                        >
                            resubmit the form
                        </button>
                        . Please make sure you have DM's & friend requests
                        enabled on the provided platform.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-6 w-full border-t border-border-2 pt-6'>
            <div className='w-full flex gap-2.5'>
                {/* Name */}
                <Input
                    label='Your Name'
                    placeholder='John Doe'
                    value={name}
                    setValue={setName}
                    className='flex-1'
                    error={validationErrors?.name}
                />

                {/* Contact */}
                <Input
                    label='Contact Information'
                    placeholder='Telegram: @johndoe'
                    value={contact}
                    setValue={setContact}
                    className='flex-1'
                    error={validationErrors?.contact}
                />
            </div>

            {/* Project Budget */}
            <Dropdown
                label='Project Budget'
                value={budget}
                onChange={setBudget}
                options={[
                    { label: '$500 - $1,000', value: '500-1000' },
                    { label: '$1,000 - $5,000', value: '1000-5000' },
                    { label: '$5,000 - $10,000', value: '5000-10000' },
                    { label: '$10,000 - $25,000', value: '10000-25000' },
                    { label: '$25,000 - $50,000', value: '25000-50000' },
                    { label: '$50,000+', value: '50000+' },
                ]}
                className='mt-2.5'
                error={validationErrors?.budget}
            />

            {/* Project Description */}
            <Textarea
                label='Description'
                value={description}
                setValue={setDescription}
                placeholder='A detailed description of your project, including any relevant information or requirements.'
                className='mt-2.5'
                error={validationErrors?.description}
            />

            {/* Submit */}
            <button
                className={clsx(
                    'mt-4.5 w-full bg-foreground-1 py-2.5 px-3 flex items-center justify-center',
                    isLoading
                        ? 'opacity-80 cursor-not-allowed'
                        : 'cursor-pointer hover:opacity-90',
                )}
                onClick={submitForm}
                disabled={isLoading}
            >
                <span className='text-xs sm:text-sm font-medium text-background-1'>
                    {isLoading ? 'Submitting Form...' : 'Submit Form'}
                </span>
            </button>
        </div>
    );
};

export { Form };
