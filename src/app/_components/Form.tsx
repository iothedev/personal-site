'use client';

import clsx from 'clsx';
import { useState, useCallback, useRef } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import { Input, Textarea, Dropdown } from '@/components';

import type { RawValidationError, ValidationErrors } from '@/types';

const TURNSTILE_PUBLIC_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
if (!TURNSTILE_PUBLIC_KEY) {
    throw new Error('NEXT_PUBLIC_TURNSTILE_SITE_KEY not defined in .env');
}

const Form = () => {
    const [name, setName] = useState<string>('');
    const [contact, setContact] = useState<string>('');
    const [budget, setBudget] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const [error, setError] = useState<null | string>(null);
    const [validationErrors, setValidationErrors] =
        useState<null | ValidationErrors>(null);

    const turnstileRef = useRef<TurnstileInstance | null>(null);

    const submitForm = useCallback(() => {
        setError(null);
        setValidationErrors(null);

        setIsLoading(true);

        fetch(`/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                contact,
                budget,
                description,
                captchaToken,
            }),
        })
            .then((res) => res.json())
            .then(({ error }) => {
                turnstileRef.current?.reset();
                setCaptchaToken(null);

                if (error?.issues) {
                    const formattedErrors = Object.fromEntries(
                        error.issues.map((issue: RawValidationError) => [
                            issue.path[0],
                            issue.message,
                        ]),
                    );

                    setValidationErrors(formattedErrors);
                    return;
                }

                if (error?.message) {
                    setError(error.message);
                    return;
                }

                setIsSubmitted(true);
                setValidationErrors(null);
                setError(null);
            })
            .finally(() => setIsLoading(false));
    }, [name, contact, budget, description, captchaToken, turnstileRef]);

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
            {/* General Error */}
            {error && (
                <div className='mb-4.5 py-2 px-3 bg-red-1/10 border border-red-1/15'>
                    <span className='text-xs sm:text-sm font-medium text-red-1'>
                        {error}
                    </span>
                </div>
            )}

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

            {/* Invisible Captcha */}
            <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_PUBLIC_KEY}
                onSuccess={setCaptchaToken}
                options={{
                    theme: 'light',
                    size: 'invisible',
                }}
            />

            {/* Captcha Message */}
            {!captchaToken && (
                <span className='mt-1.5 text-xs font-medium text-foreground-3 animate-pulse'>
                    Verifying you are human...
                </span>
            )}

            {/* Submit */}
            <button
                className={clsx(
                    'mt-4.5 w-full bg-foreground-1 py-2.5 px-3 flex items-center justify-center',
                    !captchaToken || isLoading
                        ? 'opacity-80 cursor-not-allowed'
                        : 'cursor-pointer hover:opacity-90',
                )}
                onClick={submitForm}
                disabled={!captchaToken || isLoading}
            >
                <span className='text-xs sm:text-sm font-medium text-background-1'>
                    {isLoading ? 'Submitting Form...' : 'Submit Form'}
                </span>
            </button>

            {/* Legal Disclaimer */}
            <span className='block mt-2 text-xs font-medium text-foreground-3'>
                Protected by Cloudflare Turnstile - Privacy Addendum applies
            </span>
        </div>
    );
};

export { Form };
