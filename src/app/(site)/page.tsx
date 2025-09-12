import { Logo } from '@/components/header/header-temp';
import { BetaNotice } from '@/components/ui/beta-notice';
import { Notice } from '@/components/ui/notice-temp';
import { name as packageName, version } from '@package';
import { Ghost, Star } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  return (
    <div className='flex flex-col w-full'>
      <section
        id='hero-section'
        className='flex flex-col gap-4 py-24 w-full text-center items-center px-default'>
        <div
          id='logo-glow-container'
          className='relative inline-block'>
          <Star
            className='blur-md absolute animate-rotate-slow'
            size='72px'
            color='var(--color-yellow-300)'
          />
          <Ghost
            size='72px'
            color='var(--color-accent)'
          />
        </div>

        <h1>Welcome To {packageName}</h1>
        <article>
          <p className='text-gray-300'>
            Discover spontaneous local gatherings and join in when the mood strikes. Create events,
            meet new people, and connect in real life — all with a tap.
          </p>
        </article>
        <div className='flex gap-2 w-full justify-center items-center'>
          <Link href='/register'>
            <button className='--contained --accent'>Register Now</button>
          </Link>
          <Link href='/login'>
            <button className='--outlined --secondary'>Login</button>
          </Link>
        </div>
        <BetaNotice />
      </section>
      <section className='flex flex-col gap-8 py-24 items-center px-default bg-background-light'>
        <h2>What Is {packageName}?</h2>
        <p className='text-gray-300'>
          {packageName} is a platform for creating and discovering unofficial, small, local social
          events. Whether you're hosting a board game, a casual meetup, or just hanging out, you can
          list your event for others nearby to find and join. The app makes it easy to connect with
          people in your area, join gatherings spontaneously, and meet new friends in real life.
        </p>
      </section>
      <section className='flex flex-col gap-8 py-24 items-center px-default'>
        <h2>Features</h2>
        <ul className='flex flex-col gap-4'>
          <FeatureListItem title='Create Local Events'>
            Easily set up spontaneous gatherings with a title, description, category, size, and
            available spots. Your location is automatically set so nearby users can discover your
            event.
          </FeatureListItem>
          <FeatureListItem title='Automatic Joining & Leaving'>
            Show interest in any event and you'll be joined automatically when you're close by. Move
            away, and you'll leave the event — no manual check-ins needed.
          </FeatureListItem>
          <FeatureListItem title='Host Controls'>
            Hosts can end events by moving away, or tapping a button, ensuring gatherings stay
            relevant and local.
          </FeatureListItem>
        </ul>
      </section>
      <footer className='py-24 bg-background-light px-default flex flex-col gap-8 items-center'>
        <div className='flex flex-col gap-2'>
          <Link href='/terms.pdf'>Terms Of Service</Link>
        </div>

        <div className='flex flex-col gap-2 items-center'>
          <Logo />
          <small>{version}</small>
        </div>
      </footer>
    </div>
  );
}

function FeatureListItem({ children, title }) {
  return (
    <li className='flex flex-col bg-background-light rounded-xl p-4 border border-gray-400'>
      <h3>{title}</h3>
      <p className='text-gray-300'>{children}</p>
    </li>
  );
}
