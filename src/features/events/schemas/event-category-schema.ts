import z from 'zod';

export type TEventCategory = 'game' | 'other';
export const eventCategories: TEventCategory[] = ['game', 'other'];
export const eventCategorySchema = z.enum(eventCategories);
