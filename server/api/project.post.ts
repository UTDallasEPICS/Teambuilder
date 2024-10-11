// TODO: need to do partner connection
async function connectToPartner(event) {
  // Implement the connection logic here later
  const partnerData = await readBody(event);
  return partnerData;
}

export default defineEventHandler(async event => {
  const { name } = await readBody(event);
  return await event.context.client.project.create({
      data: {
       name,
       partnerData,
      },
    });
});
