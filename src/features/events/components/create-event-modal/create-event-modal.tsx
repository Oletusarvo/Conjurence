import { Modal } from '@/components/modal-temp';
import { useModalStackContext } from '@/providers/modal-stack-provider';
import { CreateEventForm } from '../create-event-form/create-event-form';
import { useState } from 'react';
import { EventProvider } from '../../providers/event-provider';
import { TEvent } from '../../schemas/event-schema';
import { SelectActionStep } from './select-action-step';
import { SelectTemplateStep } from './select-template-step';

export function CreateEventModal() {
  const [currentStep, setCurrentStep] = useState<'select-action' | 'select-template' | 'create'>(
    'select-action'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<TEvent>(null);
  const { setModal } = useModalStackContext();
  return (
    <Modal
      title='Create Event'
      show={true}
      fullHeight
      onClose={() => setModal(null)}>
      <div className='flex flex-col w-full flex-1 px-default py-2 gap-2'>
        {currentStep === 'select-action' ? (
          <SelectActionStep onActionSelected={action => setCurrentStep(action)} />
        ) : currentStep === 'select-template' ? (
          <SelectTemplateStep
            onTemplateSelected={template => {
              setSelectedTemplate(template);
              setCurrentStep('create');
            }}
            onNewEvent={() => setCurrentStep('create')}
          />
        ) : (
          <EventProvider initialEvent={selectedTemplate}>
            <CreateEventForm onCancel={() => setCurrentStep('select-action')} />
          </EventProvider>
        )}
      </div>
    </Modal>
  );
}
