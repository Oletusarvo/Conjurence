import { Ellipsis } from 'lucide-react';
import { Input } from './input-temp';

export function PasswordInput(props: React.ComponentProps<'input'>) {
  return (
    <Input
      {...props}
      type='password'
      icon={<Ellipsis />}
    />
  );
}
