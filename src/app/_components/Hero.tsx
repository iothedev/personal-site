import Icons from '@/icons';

import type { ReactNode } from 'react';

const SOCIALS: {
    icon: ReactNode;
    platform: string;
    username: string;
    href: string;
}[] = [
    {
        icon: <Icons.GitHub className='h-4.5' />,
        platform: 'GitHub',
        username: 'iothedev',
        href: 'https://github.com/iothedev',
    },

    {
        icon: <Icons.X className='h-4' />,
        platform: 'X',
        username: 'iothedev',
        href: 'https://x.com/iothedev',
    },

    {
        icon: <Icons.Telegram className='h-4' />,
        platform: 'Telegram',
        username: 'iothedev',
        href: 'https://t.me/iothedev',
    },

    {
        icon: <Icons.Discord className='h-4' />,
        platform: 'Discord',
        username: 'iothedev',
        href: 'https://discord.com/users/1080311571324084275',
    },
];

const Hero = () => (
    <div className='flex flex-col max-w-[364px]'>
        <div className='flex items-center'>
            {/* Avatar */}
            <img className='size-7' src='/avatar.webp' />

            {/* Username */}
            <span className='ml-3 text-2xl font-medium'>iothedev</span>

            {/* Pronounciation */}
            <span className='ml-2.5 text-xs text-foreground-3 italic'>
                (eye-oh-the-dev)
            </span>
        </div>

        {/* Description */}
        <span className='mt-3 text-[13px] font-medium text-foreground-2'>
            From frontend to backend, I turn ideas into fully functional
            products with clean design, solid architecture, and performance that
            holds up under real users.
        </span>

        {/* Socials */}
        <div className='mt-4.5 flex gap-6 flex-wrap'>
            {SOCIALS.map(({ icon, platform, href }) => (
                <a
                    key={href}
                    href={href}
                    target='_blank'
                    className='group flex items-center gap-2.5 select-none cursor-pointer'
                >
                    {icon}

                    {/* Platform */}
                    <span className='text-xs sm:text-sm font-medium leading-none! group-hover:underline'>
                        {platform}
                    </span>
                </a>
            ))}
        </div>
    </div>
);

export { Hero };
