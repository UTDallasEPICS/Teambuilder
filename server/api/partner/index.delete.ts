// TODO: Test Delete Functionality
export default defineEventHandler(async (event) => {
    // Get the ID from the query parameters
    const { id } = getQuery(event);
  
    // Perform the delete operation
    const deletedPartner = await event.context.client.partner.delete({
      where: {
        id: id,  // Delete the record with the given ID
      },
    });
  
    // Return the deleted partner
    return deletedPartner;
  });
  