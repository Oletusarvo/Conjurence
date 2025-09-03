import { Modal } from '@/components/modal-temp';
import { useEventContext } from '../../providers/event-provider';

export function EventModal(props) {
  const { event } = useEventContext();
  return (
    <Modal
      {...props}
      show={true}
      title=''></Modal>
  );
}
