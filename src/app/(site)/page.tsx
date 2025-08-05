import { Logo } from '@/components/header/Header';
import { name as packageName, version } from '@package';
import { Facebook, Github, Instagram, Star, Waypoints } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  return (
    <div className='flex flex-col w-full'>
      <section
        id='hero-section'
        className='flex flex-col gap-2 py-24 w-full text-center items-center px-2'>
        <Waypoints
          size='var(--text-7xl)'
          color='var(--color-accent)'
        />
        <h1>Welcome To {packageName}</h1>
        <article>
          <p className='text-gray-300'>
            Real places. Real people. One night at a time. Find or start local hangouts — card
            games, stargazing, strange talks, or just kicking it. Show up, vibe out.
          </p>
        </article>
        <div className='flex gap-2 w-full justify-center'>
          <Link href='/register'>
            <button className='--contained --accent'>Register Now</button>
          </Link>
          <Link href='/login'>
            <button className='--outlined --accent'>Or Login</button>
          </Link>
        </div>
      </section>
      <section className='flex flex-col gap-8 py-24 items-center px-2'>
        <h2>Features</h2>
        <ul className='flex flex-col gap-4'>
          <li className='flex flex-col bg-background-light rounded-xl p-4 border border-gray-500'>
            <h3>Create Events</h3>
            <p className='text-gray-300'>
              Start something simple — a rooftop hangout, poker night, street chess, or night walk.
              Add a title, description, and location. That’s it.
            </p>
          </li>
          <li className='flex flex-col bg-background-light rounded-xl p-4 border border-gray-500'>
            <h3>Show Interest</h3>
            <p className='text-gray-300'>
              Click the star to let others know you're intrigued — it's not a commitment, just a
              signal. Hosts and other users can see who's circling the vibe.
            </p>
          </li>

          <li className='flex flex-col bg-background-light rounded-xl p-4 border border-gray-500'>
            <h3>Local & Real</h3>
            <p className='text-gray-300'>
              Everything here happens in the real world. Browse events around you and decide for
              yourself if you want to show up.
            </p>
          </li>
        </ul>
      </section>
      <footer className='py-24 bg-background-light px-2 flex flex-col gap-8 items-center'>
        <div className='flex flex-col gap-2'>
          <Link href='/terms'>Terms Of Service</Link>
        </div>

        <div className='flex flex-col gap-2 items-center'>
          <Logo />

          <small>{version}</small>
        </div>
      </footer>
    </div>
  );
}
