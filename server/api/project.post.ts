// TODO: need to do partner connection
async function connectToPartner(event) {
  // Implement the connection logic here later
  const partnerData = await readBody(event);
  const partner = await event.context.client.team.create({
    data: {
      partner: {
        connect: { id: partnerData }
      }
    },
    include: {
      partner: true
    }
  });
  return partner;
};

export default defineEventHandler(async event => {
  const { name } = await readBody(event);
  return await event.context.client.project.create({
      connectToPartner
    });
});

//Updated event handler to return connect to partner function

/*
// Function to connect to a partner
async function connectToPartner(event, projectId) {
  // Extract partner data from the request body
  const { partnerId } = await readBody(event);
  // Use the partner ID to connect it to a project (or team)
  const project = await event.context.client.project.update({
    where: { id: projectId }, // Reference the correct project
    data: {
      partner: { // Connect to the partner by their ID
        connect: { id: partnerId }
      }
    },
    include: {
      partner: true // Optionally include partner details in the response
    }
  });

  return project;
}

export default defineEventHandler(async (event) => {
  // Extract project name and other necessary data from request body
  const { name, partnerId } = await readBody(event);

  // Create the project first
  const project = await event.context.client.project.create({
    data: {
      name, // Create the project with the provided name
    }
  });

  // Connect the project to a partner, if a partnerId exists
  if (partnerId) {
    const updatedProject = await connectToPartner(event, project.id);
    return updatedProject; // Return the project after connecting the partner
  }

  return project; // If no partnerId, return the project without the partner connection
});*/