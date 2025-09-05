import { Database, File } from 'lucide-react';

export function SelectActionStep({ onActionSelected }) {
  return (
    <div className='flex flex-col gap-2 w-full h-full justify-center'>
      <button
        className='--contained --accent flex gap-2 items-center'
        onClick={() => onActionSelected('create')}>
        <IconContainer>
          <File size='24px' />
        </IconContainer>

        <TextContainer>
          <span>New</span>
          <p>Create a new event from scratch.</p>
        </TextContainer>
      </button>
      <button
        className='--outlined --accent flex gap-2 items-center'
        onClick={() => onActionSelected('select-template')}>
        <IconContainer>
          <Database size='24px' />
        </IconContainer>

        <TextContainer>
          <span>From Template</span>
          <p className='text-sm font-normal text-left'>
            Made an awesome event in the past and don't feel like re-typing everything? Tap here and
            use it as a template!
          </p>
        </TextContainer>
      </button>
    </div>
  );
}

function IconContainer({ children }: React.PropsWithChildren) {
  return <div>{children}</div>;
}

function TextContainer({ children }: React.PropsWithChildren) {
  return <div className='flex flex-col items-start flex-1'>{children}</div>;
}
