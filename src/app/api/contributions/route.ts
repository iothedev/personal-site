import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

import type { Contribution } from '@/types';

const GITHUB_USERNAME = 'iothedev';

const GET = async () => {
    const html = await fetch(
        `https://github.com/users/${GITHUB_USERNAME}/contributions`,
        { cache: 'no-store' },
    ).then((res) => res.text());

    const $ = cheerio.load(html);
    const contributionMap = new Map<string, Contribution>();

    $('td.ContributionCalendar-day').each((_, el) => {
        const date = $(el).attr('data-date');
        const level = Number($(el).attr('data-level'));
        const id = $(el).attr('id');

        if (!date) return;

        const tooltip = $(`tool-tip[for="${id}"]`).text();

        const match = tooltip.match(/(\d+)\s+contribution/i);
        const count = Number(match?.[1] ?? 0);

        contributionMap.set(date, { date, level, count });
    });

    const contributions = Array.from(contributionMap.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return NextResponse.json({ contributions });
};

export { GET };
