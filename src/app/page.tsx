import { ContributionGraph, Hero, Timezone } from './_components';

const Home = () => (
    <div className='mt-12 sm:mt-44 w-full max-w-[646px] mx-auto px-6 overflow-x-hidden'>
        <div className='w-full flex gap-6 items-start justify-between flex-col-reverse md:flex-row pb-6'>
            <Hero />
            <Timezone />
        </div>

        <ContributionGraph />
    </div>
);

export default Home;
