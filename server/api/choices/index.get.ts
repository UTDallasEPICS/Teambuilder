import choiceService from "~/server/services/choiceService";

export default defineEventHandler(async () => {
  return await choiceService.getAllChoices();
});
