'use server';

import { loadSession } from '@/util/load-session';
import { userService } from '../services/user-service';
import db from '@/dbconfig';

export async function deleteUserAction(): Promise<ActionResponse<void, string>> {
  try {
    const session = await loadSession();
    await userService.repo.deleteById(session.user.id, db);
    return { success: true };
  } catch (err: any) {
    console.log(err.message);
    return { success: false, error: 'An unexpected error occured!' };
  }
}
