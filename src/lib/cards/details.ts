import { db } from '@/lib/db/client';
import { z } from 'zod';

export const cardDetails = (id: string) => {
  if (!z.string().uuid().safeParse(id).success) return Promise.resolve(null);
  return db.card.findUnique({ where: { id }, include: { country: true, instances: { where: { assignedAt: null } } } });
};
