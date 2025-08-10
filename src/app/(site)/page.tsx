import { Logo } from '@/components/header/Header';
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
            Conjure a casual hangout for curious folks nearby to discover. Whether it’s a rooftop
            chat, a twilight walk, or a low-key game night, just set the title, description and
            vibe. Let the evening take shape and see who drifts in!
          </p>
        </article>
        <div className='flex gap-2 w-full justify-center'>
          <Link href='/register'>
            <button className='--contained --accent'>Register Now</button>
          </Link>
          <Link href='/login'>
            <button className='--outlined --secondary'>Login</button>
          </Link>
        </div>
      </section>
      <section className='flex flex-col gap-8 py-24 items-center px-default bg-background-light'>
        <h2>What Is {packageName}?</h2>
        <p className='text-gray-300'>
          Here’s how it works: conjure up an event by setting a title, description, and how many
          people you’re hoping to summon. Your location is set automatically, so nearby wanderers
          can spot your gathering.
          <br />
          <br />
          If someone feels the pull, they can show interest with a single click — no binding pacts,
          just a gentle signal. Once they drift close to the event’s location, they’ll be marked as
          attending. You can always see who’s circling your event, and decide if you want to join
          others’ gatherings too.
          <br />
          <br />
          It’s all about spontaneous, real-world connections. No pressure, no fuss — just a little
          magic in the mix.
        </p>
      </section>
      <section className='flex flex-col gap-8 py-24 items-center px-default'>
        <h2>Features</h2>
        <ul className='flex flex-col gap-4'>
          <FeatureListItem>
            <h3>Create Events</h3>
            <p className='text-gray-300'>
              Start something simple — a rooftop hangout, poker night, street chess, or night walk.
              Add a title, description, and location. That’s it.
            </p>
          </FeatureListItem>
          <FeatureListItem>
            <h3>Show Interest</h3>
            <p className='text-gray-300'>
              Click the star to let others know you're intrigued — it's not a commitment, just a
              signal. Hosts and other users can see who's circling the vibe.
            </p>
          </FeatureListItem>

          <FeatureListItem>
            <h3>Local & Real</h3>
            <p className='text-gray-300'>
              Everything here happens in the real world. Browse events around you and decide for
              yourself if you want to show up.
            </p>
          </FeatureListItem>
        </ul>
      </section>
      <footer className='py-24 bg-background-light px-default flex flex-col gap-8 items-center'>
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

function FeatureListItem({ children }) {
  return (
    <li className='flex flex-col bg-background-light rounded-xl p-4 border border-gray-400'>
      {children}
    </li>
  );
}
