import choiceService from "~/server/services/choiceService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const choice = await choiceService.getChoiceById(id);
  if (!choice) {
    throw createError({statusCode: 404, statusMessage: 'Choice not found'});
  }

  return choice;
});
