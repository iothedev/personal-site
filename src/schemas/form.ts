import { z } from 'zod';

const form = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(32, 'Name must be under 32 characters'),

    contact: z
        .string()
        .min(1, 'Contact information is required')
        .max(128, 'Contact information must be under 128 characters'),

    budget: z.enum(
        [
            '500-1000',
            '1000-5000',
            '5000-10000',
            '10000-25000',
            '25000-50000',
            '50000+',
        ],
        { error: 'Please select a valid budget option' },
    ),

    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(512, 'Description must be under 512 characters'),
});

export { form };
