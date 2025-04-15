//Begun on March 30th, 2025, by Isaac Philo, with many external inputs
//This API's purpose is to support adding to the database from a file upload

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log("POST request now being handled");
    // console.log(event);
    const postBody = await readBody(event);
    // postBody.forEach((element: any) => {console.log(element)});
    //Update the database
    await postBody.forEach(async (element: any) => {
      let name: string = element.Name;
      let course: string = element.Course;
      let year: number = element.Year;
      let semester = element.Sem;
      let african_american = element.African_American ? element.African_American : 0;
      let asian = element.Asian ? element.Asian : 0;
      let hispanic = element.Hispanic ? element.Hispanic : 0;
      let international = element.International ? element.International : 0;
      let other = element.Other ? element.Other : 0;
      let white = element.White ? element.White : 0;
      let male = element.Male ? element.Male : 0;
      let female = element.Female ? element.Female : 0;
      let total = element.Total ? element.Total : 0;
      //Assuming this will return only one semester
      //Assuming a given combination of name, year, and semester is unique
      const desiredSemesters = await prisma.semester.findMany({
        where: {
          Name: name,
          Course: course,
          Year: year
        },
      });
      let prismaReturned;
      if(desiredSemesters[0]===undefined){//If the database has no entry for this semester
        prismaReturned = await prisma.semester.create({
          data: {
            Name: name,
            Course: course,
            Year: year,
            Sem: semester,
            African_American: african_american,
            Asian: asian,
            Hispanic: hispanic,
            International: international,
            Other: other,
            White: white,
            Male: male,
            Female: female,
            Total: total
          }
        });
      }
      else{//If we need to update the database
        prismaReturned = await prisma.semester.update({
          where: {
            Id: desiredSemesters[0].Id,
          },
          data: {
            Name: name,
            Course: course,
            Year: year,
            Sem: semester,
            African_American: african_american,
            Asian: asian,
            Hispanic: hispanic,
            International: international,
            Other: other,
            White: white,
            Male: male,
            Female: female,
            Total: total
          }
        });
      }
      console.log(`Prisma returned: ${prismaReturned}`);
    });
  }
  catch(error){
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error"
    }
  }
})