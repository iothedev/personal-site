import type { ReactNode } from 'react';

export type Contribution = {
    date: string;
    level: number;
    count: number;
};

export type ExperienceItem = {
    company: {
        icon: ReactNode;
        name: string;
        description: string;
    };

    duration: {
        start: string;
        end?: string;
    };

    role: string;
};
