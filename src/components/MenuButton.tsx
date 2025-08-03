import { withAlternate } from '@/hoc/withAlternate';
import { Menu, X } from 'lucide-react';

type MenuButtonProps = React.ComponentProps<'button'> & {
  toggled?: boolean;
};

export function MenuButton({ toggled, ...props }: MenuButtonProps) {
  const Button = withAlternate(({ children, ...props }) => (
    <button
      {...props}
      className='--no-default'>
      {children}
    </button>
  ));

  return (
    <Button
      {...props}
      showAlternate={toggled}
      alternate={<X />}
    />
  );
}
