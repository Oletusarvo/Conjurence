import { withIcon } from '@/hoc/withIcon';
import { withLoader } from '@/hoc/withLoader';
import { useDistanceContext } from '../providers/DistanceProvider';
import { MapPin } from 'lucide-react';
import { Badge, BadgeProps } from '@/components/ui/Badge';

export const Distance = ({ children, IconComponent = null, color = null }) => {
  const { distancePending } = useDistanceContext();
  const Component = withLoader(({ children, ...props }: BadgeProps) => {
    return (
      <div style={{ color }}>
        <Badge {...props}>{children}</Badge>
      </div>
    );
  });

  const Icon = IconComponent || MapPin;
  return (
    <Component
      loading={distancePending}
      icon={props => (
        <Icon
          {...props}
          color={color || 'white'}
        />
      )}>
      {children}
    </Component>
  );
};
