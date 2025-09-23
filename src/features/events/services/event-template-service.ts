import { Service } from '@/util/service';
import { EventTemplateRepository } from '../repos/event-template-repository';
import { DBContext } from '@/util/db-context';
import { loadSession } from '@/util/load-session';
import { tablenames } from '@/tablenames';

export class EventTemplateService extends Service<EventTemplateRepository> {
  constructor(repo) {
    super(repo);
  }

  async findTemplateById(templateId: string, ctx: DBContext) {
    const session = await loadSession();
    const [author_id] = await ctx(tablenames.event_template)
      .where({ id: templateId })
      .pluck('author_id');
    if (author_id !== session.user.id) {
      throw new Error('Only the author of a template can use it!');
    }
    return await this.repo.findTemplateById(templateId, ctx);
  }
}

export const eventTemplateService = new EventTemplateService(new EventTemplateRepository());
