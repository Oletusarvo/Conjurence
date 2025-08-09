import db from '@/dbconfig';
import { TemplateList } from '@/features/events/components/TemplateList';
import { SearchProvider } from '@/providers/SearchProvider';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';

export default async function EventTemplatesPage({ searchParams }) {
  const { q } = await searchParams;
  const session = await loadSession();
  const templates = await db(tablenames.event_data)
    .where(function () {
      if (!q) return;
      const str = `%${q}%`;
      this.whereILike('title', str).orWhereILike('description', str);
    })
    .andWhere({ author_id: session.user.id, is_template: true })

    .select('title', 'description', 'spots_available', 'id');
  return (
    <div className='flex flex-col gap-2 w-full p-2 h-full'>
      <SearchProvider>
        <TemplateList templates={templates} />
      </SearchProvider>
    </div>
  );
}
