export const getCookieSameSite = () =>
  (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict';
