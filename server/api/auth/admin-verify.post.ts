export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body;

  if (!password) {
    throw createError({ statusCode: 400, message: 'Password is required.' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw createError({ statusCode: 500, message: 'Admin password is not configured on the server.' });
  }

  if (password !== adminPassword) {
    throw createError({ statusCode: 401, message: 'Incorrect password.' });
  }

  return { success: true };
});