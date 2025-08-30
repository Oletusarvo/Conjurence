import { PassProps } from '@/components/feature/pass-props';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import React, { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

const [TagInputContext, useTagInputContext] = createContextWithUseHook<{
  tags: string[];
  currentValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  applyTag: () => void;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentValue: React.Dispatch<string>;
}>();

export function TagInputProvider({ children }: React.PropsWithChildren) {
  const [tags, setTags] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useState('');

  const applyTag = () => {
    if (currentValue === '') return;

    setTags([...tags, currentValue]);
    setCurrentValue('');
  };

  const applyOnEnter = e => {
    if (e.code === 'Enter') {
      applyTag();
    }
  };

  useEffect(() => {
    document.addEventListener('keypress', applyOnEnter);

    return () => {
      document.removeEventListener('keypress', applyOnEnter);
    };
  }, [tags, applyOnEnter, applyTag]);

  return (
    <TagInputContext value={{ tags, inputRef, currentValue, applyTag, setCurrentValue, setTags }}>
      {children}
    </TagInputContext>
  );
}

TagInputProvider.Input = function ({ children }: React.PropsWithChildren) {
  const { currentValue, setCurrentValue, inputRef } = useTagInputContext();
  const [child] = React.Children.toArray(children);
  return (
    <PassProps
      ref={inputRef}
      value={currentValue}
      onChange={e => setCurrentValue(e.target.value)}>
      {child}
    </PassProps>
  );
};

TagInputProvider.Tags = function ({ component: Component }: { component: ({ tag }) => ReactNode }) {
  const { tags } = useTagInputContext();
  return tags.map((t, i) => (
    <Component
      tag={t}
      key={`tag-input-provider-tag-${t}-${i}`}
    />
  ));
};

TagInputProvider.ApplyButton = function ({ children }: React.PropsWithChildren) {
  const { applyTag, setCurrentValue, currentValue } = useTagInputContext();

  return (
    <PassProps
      onClick={e => {
        if (currentValue === '') return;
        applyTag();
        setCurrentValue('');
      }}>
      {children}
    </PassProps>
  );
};

TagInputProvider.RemoveTagButton = function ({
  children,
  tagToRemove,
}: React.PropsWithChildren & { tagToRemove: string }) {
  const { setTags } = useTagInputContext();
  return (
    <PassProps
      onClick={e => {
        setTags(prev => prev.filter(t => t !== tagToRemove));
      }}>
      {children}
    </PassProps>
  );
};
