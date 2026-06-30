import { clsx } from 'clsx';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';

import type { Metadata } from 'next';

const ppNeueMontreal = localFont({
    src: [
        {
            path: '../fonts/ppneuemontreal-thin.woff',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../fonts/ppneuemontreal-book.woff',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../fonts/ppneuemontreal-italic.woff',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../fonts/ppneuemontreal-medium.woff',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../fonts/ppneuemontreal-semibolditalic.woff',
            weight: '600',
            style: 'italic',
        },
        {
            path: '../fonts/ppneuemontreal-bold.woff',
            weight: '700',
            style: 'normal',
        },
    ],

    variable: '--font-pp-neue-montreal',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'iothedev',

    description:
        'From frontend to backend, I turn ideas into fully functional products with clean design, solid architecture, and performance that holds up under real users.',

    openGraph: {
        type: 'website',
        siteName: 'iothe.dev',
        title: 'Full-Stack Web-Developer and Web-Designer',
    },
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <html
        lang='en'
        className={clsx(ppNeueMontreal.variable, 'h-full antialiased')}
    >
        <body className='min-h-full flex flex-col'>
            {children}

            <Analytics />
        </body>
    </html>
);

export default RootLayout;
