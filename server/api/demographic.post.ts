//Begun on March 30th, 2025, by Isaac Philo, with many external inputs
//This API's purpose is to support adding to the database from a file upload

import { PrismaClient } from "@prisma/client"
import xlsx from 'node-xlsx';
import * as XLSX from 'xlsx'; //This will be better used as https://docs.sheetjs.com/docs/getting-started/installation/nodejs#vendoring

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const postBody = await readBody(event);//Assuming this gets the whole file through in one go, like in https://nuxt.com/docs/guide/directory-structure/server#body-handling.
    //If that is not true, then this page may be helpful: https://austingil.com/file-uploads-in-node/
    XLSX.utils.decode_range("J34:W57");
    
  }
  catch (error) {//borrowed from the GET API
    console.error(error);
    return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown Error"
    }
  }
})
