import { z } from 'zod';
import { NextResponse } from 'next/server';

const BUDGETS = [
    { label: '$500 - $1,000', value: '500-1000' },
    { label: '$1,000 - $5,000', value: '1000-5000' },
    { label: '$5,000 - $10,000', value: '5000-10000' },
    { label: '$10,000 - $25,000', value: '10000-25000' },
    { label: '$25,000 - $50,000', value: '25000-50000' },
    { label: '$50,000+', value: '50000+' },
];

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK) {
    throw new Error('DISCORD_WEBHOOK_URL not defined in .env');
}

const schema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be under 100 characters'),

    contact: z
        .string()
        .min(1, 'Contact information is required')
        .max(200, 'Contact information must be under 200 characters'),

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
        .max(2000, 'Description must be under 2000 characters'),
});

const POST = async (req: Request) => {
    const body = await req.json();

    const { error, data } = schema.safeParse(body);

    if (error) {
        const formattedErrors = Object.fromEntries(
            error.issues.map((issue) => [issue.path[0], issue.message]),
        );

        return NextResponse.json({
            success: false,
            error: formattedErrors,
        });
    }

    const { name, contact, budget: rawBudget, description } = data;

    const budget =
        BUDGETS.find(({ value }) => value === rawBudget)?.label ?? rawBudget;

    const embed = {
        title: 'New Form Submission',
        fields: [
            {
                name: '🙋 Name',
                value: `\`${name}\``,
                inline: true,
            },
            {
                name: '✉️ Contact',
                value: `\`${contact}\``,
                inline: true,
            },
            {
                name: '💰 Budget',
                value: `\`${budget}\``,
                inline: true,
            },
            {
                name: '📝 Description',
                value: `\`\`\`${description}\`\`\``,
                inline: false,
            },
        ],
        timestamp: new Date().toISOString(),
    };

    await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '@everyone', embeds: [embed] }),
    });

    return NextResponse.json({ success: true });
};

export { POST };
