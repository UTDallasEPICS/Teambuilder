//Begun on March 30th, 2025, by Isaac Philo, with many external inputs
//This API's purpose is to support adding to the database from a file upload

import { PrismaClient } from "@prisma/client"
import xlsx from 'node-xlsx';
import * as XLSX from 'xlsx'; //This will be better used as https://docs.sheetjs.com/docs/getting-started/installation/nodejs#vendoring

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log("POST request now being handled");
    // console.log(event);
    const postBody = await readBody(event);
    const binaryDataInBody = postBody.body;
    console.log(`postBody = ${postBody}`);
    //Assuming this gets the whole file through in one go, like in https://nuxt.com/docs/guide/directory-structure/server#body-handling.
    //If that is not true, then this page may be helpful: https://austingil.com/file-uploads-in-node/
    //relevant tutorial page for remote file processing: https://docs.sheetjs.com/docs/solutions/input#example-remote-file
    const workbook = XLSX.read(await Buffer.from(binaryDataInBody)); //Assuming that the whole post body will be the file.
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    //const relevantRange = XLSX.utils.decode_range("J34:W57"); //This may need to be horizontally extended to accomodate future semesters. However, there's no option to have an unspecified right boundary.
    const rangeSemesterNames = XLSX.utils.decode_range("L34:V34");
    const rangeEthnicity = XLSX.utils.decode_range("K35:K44");
    const semesterNames = extractCells(worksheet, rangeSemesterNames);
    console.log(semesterNames);
    const ethnicities = extractColumnMajor(workbook, rangeEthnicity);

    const range2200 = XLSX.utils.decode_range("L35:V45");
    const range3200 = XLSX.utils.decode_range("L48:V56");
    const dataFrom2200 = extractColumnMajor(worksheet, range2200);
    const dataFrom3200 = extractColumnMajor(worksheet, range3200);
    console.log(dataFrom2200);
    console.log(dataFrom3200);
  }
  catch (error) {//borrowed from the GET API
    console.log(error);
    return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown Error"
    }
  }
})

function getColumnMajor(arr: any[]){//Requires a rectangular 2D array
    let transpose = [];
    for(let c = 0; c < arr[0].length; c++){
        let currentCol = [];
        for(let r = 0; r < arr.length; r++){
            currentCol.push(arr[r][c]);
        }
        transpose.push(currentCol); //Pushes it as, essentially, a row
    }
    return transpose;
}

function extractCells(worksheet: XLSX.WorkSheet, relevantRange: XLSX.Range){
    return XLSX.utils.sheet_to_json(worksheet, {header: 1, range: relevantRange});
}

function extractColumnMajor(worksheet: XLSX.WorkSheet, relevantRange: XLSX.Range){
    return getColumnMajor(extractCells(worksheet, relevantRange));
}