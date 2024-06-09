// TODO: extract list of students and do the join
// TODO: also connect to project
export default defineEventHandler(async event => {
  const { name } = await readBody(event);
  return event.context.client.team.create({
    data: {
      name,
    },
  });
});
