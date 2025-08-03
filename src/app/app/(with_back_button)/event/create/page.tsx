import { ContainerLink } from '@/features/events/components/ContainerLink';
import { AtSign, Database, File as FileIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function CreateEventPage() {
  return (
    <div className='flex flex-col px-2 gap-2 w-full flex-1 justify-center'>
      <h2>Create Event</h2>
      <ContainerLink
        href='/app/event/create/new'
        icon={FileIcon}>
        <h3>New</h3>
        <p className='text-yellow-50'>Create a new event from scratch.</p>
      </ContainerLink>
      <ContainerLink
        href='/app/event/create/from_template'
        icon={Database}>
        <h3>From Template</h3>
        <p className='text-yellow-50'>
          Made an awesome event in the past and don't feel like re-typing everything? Tap here and
          use it as a template!
        </p>
      </ContainerLink>
    </div>
  );
}
