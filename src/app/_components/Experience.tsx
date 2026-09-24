import Icons from '@/icons';

import type { ExperienceItem } from '@/types';

const EXPERIENCE: ExperienceItem[] = [
    /*
    {
        company: {
            icon: <Icons.Example className='w-4 text-foreground-1' />,
            name: 'Company Name',
            description: 'Company description',
        },

        duration: { start: '2024' },

        role: 'Job Title',
    },
    */
];

const Experience = () => (
    <div className='mt-6 w-full flex flex-col gap-2.5'>
        {EXPERIENCE.map(({ company, duration, role }, index) => (
            <div key={index} className='w-full flex items-start gap-3.5'>
                {company.icon}

                <div className='flex flex-1 flex-col'>
                    <div className='flex items-start justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-xs font-medium capitalize text-foreground-2 leading-none!'>
                                {role}
                            </span>

                            <span className='text-base font-medium capitalize text-foreground-1 leading-loose!'>
                                {company.name}
                            </span>
                        </div>

                        <span className='text-xs font-medium text-foreground-3'>
                            {duration.start} - {duration.end ?? 'Present'}
                        </span>
                    </div>

                    <span className='text-[13px] font-medium text-foreground-2'>
                        {company.description}
                    </span>
                </div>
            </div>
        ))}
    </div>
);

export { Experience };
