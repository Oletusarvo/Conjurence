import { Knex } from 'knex';

export abstract class Repository {
  protected static withSearch(
    query: Knex.QueryBuilder,
    search: string = null,
    columns: string[] = []
  ) {
    return query.where(function () {
      if (!search) return;
      const str = `%${search}%`;
      const [firstColumn, ...rest] = columns;
      this.whereILike(str, firstColumn);
      for (const column of rest) {
        this.orWhereILike(column, str);
      }
    });
  }
}
