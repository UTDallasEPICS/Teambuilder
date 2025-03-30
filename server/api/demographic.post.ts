//Begun on March 30th, 2025, by Isaac Philo, with many external inputs
//This API's purpose is to support adding to the database from a file upload

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const postBody = await readBody(event);//Assuming this gets the whole file through in one go, like in https://nuxt.com/docs/guide/directory-structure/server#body-handling.
    //If that is not true, then this page may be helpful: https://austingil.com/file-uploads-in-node/
    

  }
  catch (error) {//borrowed from the GET API
    console.error(error);
    return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown Error"
    }
  }
})
