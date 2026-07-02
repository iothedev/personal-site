import { NextResponse } from 'next/server';

import schema from '@/schemas';

import type { TurnstileResponse } from '@/types';

const BUDGETS = {
    '500-1000': '$500 - $1,000',
    '1000-5000': '$1,000 - $5,000',
    '5000-10000': '$5,000 - $10,000',
    '10000-25000': '$10,000 - $25,000',
    '25000-50000': '$25,000 - $50,000',
    '50000+': '$50,000+',
} as const;

const WEBHOOK = process.env.DISCORD_WEBHOOK;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;

if (!WEBHOOK || !TURNSTILE_SECRET) {
    throw new Error('DISCORD_WEBHOOK or TURNSTILE_SECRET not defined in .env');
}

const POST = async (req: Request) => {
    const body = await req.json();

    const { error, data } = schema.form.safeParse(body);

    if (error) {
        return NextResponse.json(
            { success: false, error: { issues: error.issues } },
            { status: 400 },
        );
    }

    const {
        name,
        contact,
        budget: rawBudget,
        description,
        captchaToken,
    } = data;

    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET);
    formData.append('response', captchaToken);

    const captchaResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        { method: 'POST', body: formData },
    ).then((res) => res.json() as Promise<TurnstileResponse>);

    if (!captchaResponse.success) {
        return NextResponse.json(
            { success: false, error: { message: 'Invalid captcha' } },
            { status: 400 },
        );
    }

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
