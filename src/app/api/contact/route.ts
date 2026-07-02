import { NextResponse } from 'next/server';

import schema from '@/schemas';

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
const BUDGETS = {
    '500-1000': '$500 - $1,000',
    '1000-5000': '$1,000 - $5,000',
    '5000-10000': '$5,000 - $10,000',
    '10000-25000': '$10,000 - $25,000',
    '25000-50000': '$25,000 - $50,000',
    '50000+': '$50,000+',
} as const;

if (!WEBHOOK) {
    throw new Error('DISCORD_WEBHOOK_URL not defined in .env');
}

const POST = async (req: Request) => {
    const body = await req.json();

    const { error, data } = schema.form.safeParse(body);

    if (error) {
        return NextResponse.json({
            success: false,
            error: error.issues,
        });
    }

    const { name, contact, budget: rawBudget, description } = data;

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
                value: `\`${BUDGETS[rawBudget]}\``,
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
