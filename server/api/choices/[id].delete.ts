import choiceService from "~/server/services/choiceService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  await choiceService.deleteChoice(id);
  return null;
});
