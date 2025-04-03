//Begun on March 30th, 2025, by Isaac Philo, with many external inputs
//This API's purpose is to support adding to the database from a file upload

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log("POST request now being handled");
    // console.log(event);
    const postBody = await readBody(event);
    // console.log(`postBody = ${postBody}`);
  }
  catch(error){
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error"
    }
  }
})