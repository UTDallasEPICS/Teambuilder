// TODO: need to do partner connection
import partnerPost from "./partner.post";
export default defineEventHandler(async event => {
  const { name } = await readBody(event);
  return await event.context.client.project.create({
      data: {
       name,
      },
      partnerPost
    });
});
