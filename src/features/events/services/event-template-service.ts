import { Service } from '@/util/service';
import { EventTemplateRepository } from '../repos/event-template-repository';

export class EventTemplateService extends Service<EventTemplateRepository> {
  constructor(repo) {
    super(repo);
  }
}

export const eventTemplateService = new EventTemplateService(new EventTemplateRepository());
