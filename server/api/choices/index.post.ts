import type {ChoiceCreate} from "~/server/services/choiceService";
import choiceService from "~/server/services/choiceService";

export default defineEventHandler(async (event) => {
  const data = await readBody<ChoiceCreate>(event);
  setResponseStatus(event, 201);
  return await choiceService.createChoice(data);
});
