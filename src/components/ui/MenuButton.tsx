import { withAlternate } from '@/hoc/withAlternate';
import { Menu, X } from 'lucide-react';

type MenuButtonProps = React.ComponentProps<'button'> & {
  toggled?: boolean;
};

/**Renders a button with three horizontal stripes on top of eachother. It turns to an X when toggled is set to true. */
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
