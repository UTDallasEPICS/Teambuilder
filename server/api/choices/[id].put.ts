import type {ChoiceUpdate} from "~/server/services/choiceService";
import choiceService from "~/server/services/choiceService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const data = await readBody<ChoiceUpdate>(event);
  return await choiceService.updateChoice(id, data);
});
