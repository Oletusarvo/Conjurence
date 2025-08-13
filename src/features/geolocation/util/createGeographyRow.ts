import db from '@/dbconfig';

/**Returns a raw knex-query for creating a geography row. */
export const createGeographyRow = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) =>
  db.raw(
    `ST_SetSRID(
      ST_MakePoint(
        ?,
        ?
      ),
      4326
    )::geography`,
    [longitude, latitude]
  );
