import { createClassName } from '@/util/createClassName';

export function StepTrack({ currentStep, max }) {
  const generatePips = () => {
    const pips = [];
    for (let i = 0; i < max; ++i) {
      const pipClassName = createClassName(
        i <= currentStep ? 'bg-accent' : 'bg-background-light',
        'h-1 w-full'
      );
      pips.push(
        <div
          className={pipClassName}
          key={`step-track-slot-${i}`}></div>
      );
    }
    return pips;
  };

  if (max == Infinity) {
    console.log('null');
    return null;
  } else {
    return <div className='flex gap-1 w-full'>{generatePips()}</div>;
  }
}
