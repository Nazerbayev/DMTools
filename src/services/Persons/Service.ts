import { db } from '../../database.ts';
// import type { NewPerson, Person } from '../../types.ts';

export async function findPersonById(id: number) {
  return await db.selectFrom('person')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()
}
