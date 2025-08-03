'use client';

import { Input } from './Input';
import { Plus, X } from 'lucide-react';
import { TagInputProvider } from '@/providers/TagInputProvider';

export function UserInterestTagInput() {
  //Should let users type free-form, recommending existing tags from the db as they type.
  return (
    <TagInputProvider>
      <div className='w-full max-w-full flex flex-col gap-2'>
        <div className='flex gap-2'>
          <div className='relative w-full flex items-center'>
            <TagInputProvider.Input>
              <Input
                type='text'
                placeholder='Type a tag...'
              />
            </TagInputProvider.Input>
          </div>

          <TagInputProvider.ApplyButton>
            <button className='--outlined --round --accent'>
              <Plus />
            </button>
          </TagInputProvider.ApplyButton>
        </div>

        <div className='flex gap-2 flex-wrap'>
          <TagInputProvider.Tags
            component={({ tag }) => {
              return (
                <div
                  className='--outlined py-2 px-4 rounded-full text-sm text-center flex items-center gap-2'
                  style={{
                    borderColor: 'hsl(from var(--color-accent) h s l)',
                    backgroundColor: 'hsl(from var(--color-accent) h s l / 0.1)',
                  }}>
                  {tag}
                  <TagInputProvider.RemoveTagButton tagToRemove={tag}>
                    <button className='--no-default'>
                      <X size='var(--text-sm)' />
                    </button>
                  </TagInputProvider.RemoveTagButton>
                </div>
              );
            }}
          />
        </div>
      </div>
    </TagInputProvider>
  );
}
