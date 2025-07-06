
import { createNewsletterSubscription } from './newsletter';

export const createNewsletterSubscriber = async (email: string, fullName?: string) => {
  return await createNewsletterSubscription({
    email,
    fullName
  });
};
