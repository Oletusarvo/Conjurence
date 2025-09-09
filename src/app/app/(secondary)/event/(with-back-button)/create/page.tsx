import { ContainerLink } from '@/components/ui/container-link';
import { RoundButton } from '@/components/ui/round-button';
import { ArrowLeft, AtSign, Database, File as FileIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function CreateEventPage() {
  return (
    <>
      <main className='flex flex-col px-default gap-2 w-full flex-1 justify-center relative'>
        <h2>Create Event</h2>
        <ContainerLink
          href='/app/event/create/new'
          icon={FileIcon}>
          <h3>New</h3>
          <p>Create a new event from scratch.</p>
        </ContainerLink>
        <ContainerLink
          href='/app/event/create/from_template'
          icon={Database}>
          <h3>From Template</h3>
          <p>
            Made an awesome event in the past and don't feel like re-typing everything? Tap here and
            use it as a template!
          </p>
        </ContainerLink>
      </main>
      <div className='w-full flex p-4 items-center justify-center'>
        <Link href='/app/feed'>
          <RoundButton>
            <ArrowLeft />
          </RoundButton>
        </Link>
      </div>
    </>
  );
}
