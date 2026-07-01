import { ContributionGraph, Hero, Timezone, Availability } from './_components';

const Home = () => (
    <div className='mt-12 sm:mt-44 w-full max-w-[646px] mx-auto px-6 overflow-x-hidden'>
        <div className='w-full flex gap-6 items-start justify-between flex-col-reverse md:flex-row pb-6'>
            <Hero />

            <div className='ml-auto flex flex-row-reverse md:flex-col items-end gap-2.5'>
                <Timezone />
                <Availability />
            </div>
        </div>

        <ContributionGraph />
    </div>
);

export default Home;
