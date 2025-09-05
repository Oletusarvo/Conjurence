import { withLoader } from '@/hoc/with-loader';
import { Plus } from 'lucide-react';

export const RoundButton = withLoader(({ children, ...props }) => (
  <button
    {...props}
    className='--round --no-default --contained --theme w-[50px] h-[50px] flex items-center justify-center shadow-md'>
    {children}
  </button>
));

export const AddButton = props => (
  <RoundButton {...props}>
    <Plus color='black' />
  </RoundButton>
);
