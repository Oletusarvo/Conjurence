import { withIcon } from '@/hoc/withIcon';
import { withLoader } from '@/hoc/withLoader';
import { useDistanceContext } from '../providers/DistanceProvider';
import { MapPin } from 'lucide-react';

export const Distance = ({ children, IconComponent = null, color = null }) => {
  const { distancePending } = useDistanceContext();
  const Component = withIcon(
    withLoader(({ children, ...props }) => {
      return (
        <div
          {...props}
          className='flex gap-1 items-center'
          style={{ color }}>
          {children}
        </div>
      );
    })
  );

  const Icon = IconComponent || MapPin;
  return (
    <Component
      loading={distancePending}
      icon={
        <Icon
          size={'14px'}
          color={color || 'white'}
        />
      }>
      {children}
    </Component>
  );
};
