import { withIcon } from '@/hoc/with-icon';
import { withLoader } from '@/hoc/with-loader';
import { useDistanceContext } from '../providers/distance-provider';
import { MapPin } from 'lucide-react';
import { Badge, BadgeProps } from '@/components/ui/badge-temp';

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
