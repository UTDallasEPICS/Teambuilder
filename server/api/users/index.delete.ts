import {prisma} from "~/server/utils/db";

export default defineEventHandler(async event => {
  const { id } = getQuery<{id: string}>(event);
  await prisma.user.delete({
    where: { id },
  });
});