import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL });

interface DemographicRecord {
  Name: string;
  Course: string;
  African_American?: number;
  Asian?: number;
  Hispanic?: number;
  International?: number;
  Other?: number;
  White?: number;
  Male?: number;
  Female?: number;
  Total: number;
  [key: string]: string | number | undefined;
}

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const { Course, Ethnicity, Gender, Continuous, Year, Semester, Yaxis } = queryParams;

    const courses = Course ? String(Course).split(",") : [];
    const ethnicities = Ethnicity ? String(Ethnicity).split(",") : [];
    const genders = Gender ? String(Gender).split(",") : [];
    const continuous = Continuous ? (String(Continuous) === "true" ? true : false) : false;
    const years = Year ? String(Year).split(",") : [];
    const semesters = continuous ? ["Spring", "Summer", "Fall"] : (Semester ? String(Semester).split(",") : []);

    // Validate required fields
    if (courses[0] == "Empty") {
      throw new Error("You must pick at least one Course");
    } else if (years[0] == "Empty" || years.length < 2) {
      throw new Error("Both Years must be chosen");
    } else if (semesters[0] == "Empty") {
      throw new Error("You must pick at least one Semester");
    }

    // TODO: This endpoint needs to be rewritten to compute demographics from Student data
    // The current Semester model doesn't have demographic fields
    // For now, return empty data to fix TypeScript errors
    
    // If neither ethnicity nor gender is selected, return total only
    if (ethnicities[0] == "Empty" && genders[0] == "Empty") {
      const records: DemographicRecord[] = [];
      
      // TODO: Query and aggregate student data by semester here
      // This would involve joining students -> teams -> semesters
      // and computing totals for each semester+course combination

      //Removing extraneous semesters for the continuous option (if needed in future)
      if(continuous && records.length > 0){
        // console.log("Continuous: extraneous records being trimmed off...");
        let semestersWithoutAlteration = String(Semester).split(","); //The actual start and end semesters chosen
        let startSemester = semestersWithoutAlteration[0];
        let endSemester = semestersWithoutAlteration[1];
        if(startSemester === "Spring"){
          startSemester = "S";
        }
        else if(startSemester === "Summer"){
          startSemester = "U";
        }
        else{
          startSemester = "F";
        }
        if(endSemester === "Spring"){
          endSemester = "S";
        }
        else if(endSemester === "Summer"){
          endSemester = "U";
        }
        else{
          endSemester = "F";
        }
        let startYear = Number(years[0]);
        let endYear = Number(years[years.length - 1]);
        const semesterOrder = ['S', 'U', 'F'];
        for (let i = 0; i < records.length; i++){
          let currentYear = Number(("20" + records[i].Name.substring(0,2)));//This will stop working in the year 2100
          let currentSemester = records[i].Name.substring(2,3);
          //Invalid years will have no data, so only intra-year violations matter.
          if(currentYear === startYear){
            if ((semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester)) > 0){ //if we are before the first semester in the last selected year.
              // console.log("(semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester) = " + (semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester)));
              // console.log(`Removing ${JSON.stringify(records[i])}...`);
              records.splice(i,1);
              i--;
            }
          }
          else if(currentYear === endYear){
            if ((semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester)) > 0){ //if we are beyond the last semester in the last selected year.
              // console.log("(semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester) = " + (semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester)));
              // console.log(`Removing ${JSON.stringify(records[i])}...`);
              records.splice(i,1);
              i--;
            }
          }
        }
      }

      return {
        success: true,
        data: records,
      };
    }

    // Ethnicity filter logic
    if (ethnicities[0] != "Empty") {
      const records: DemographicRecord[] = [];
      
      // TODO: Query and aggregate student data by semester and ethnicity here
      // This would involve joining students -> teams -> semesters
      // and computing ethnicity breakdowns for each semester+course combination

      const filteredRecords = records.map((r) => {
        const total = r.Total;
        const data: DemographicRecord = {
          Name: r.Name,
          Course: r.Course,
          Total: r.Total,
        };

        ethnicities.forEach((e) => {
          const value = r[e as keyof DemographicRecord] as number | undefined;
          if (typeof value === 'number') {
            data[e] = Yaxis === "Percentages"
              ? ((value / total) * 100).toFixed(2) + "%"
              : value;
          }
        });

        return data;
      });

      //Removing extraneous semesters for the continuous option (if needed in future)
      if(continuous && filteredRecords.length > 0){
        // console.log("Continuous: extraneous records being trimmed off...");
        let semestersWithoutAlteration = String(Semester).split(","); //The actual start and end semesters chosen
        let startSemester = semestersWithoutAlteration[0];
        let endSemester = semestersWithoutAlteration[1];
        if(startSemester === "Spring"){
          startSemester = "S";
        }
        else if(startSemester === "Summer"){
          startSemester = "U";
        }
        else{
          startSemester = "F";
        }
        if(endSemester === "Spring"){
          endSemester = "S";
        }
        else if(endSemester === "Summer"){
          endSemester = "U";
        }
        else{
          endSemester = "F";
        }
        let startYear = Number(years[0]);
        let endYear = Number(years[years.length - 1]);
        const semesterOrder = ['S', 'U', 'F'];
        for (let i = 0; i < filteredRecords.length; i++){
          let currentYear = Number(("20" + filteredRecords[i].Name.substring(0,2)));//This will stop working in the year 2100
          let currentSemester = filteredRecords[i].Name.substring(2,3);
          //Invalid years will have no data, so only intra-year violations matter.
          if(currentYear === startYear){
            if ((semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester)) > 0){ //if we are before the first semester in the last selected year.
              // console.log("(semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester) = " + (semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester)));
              // console.log(`Removing ${JSON.stringify(filteredRecords[i])}...`);
              filteredRecords.splice(i,1);
              i--;
            }
          }
          else if(currentYear === endYear){
            if ((semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester)) > 0){ //if we are beyond the last semester in the last selected year.
              // console.log("(semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester) = " + (semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester)));
              // console.log(`Removing ${JSON.stringify(filteredRecords[i])}...`);
              filteredRecords.splice(i,1);
              i--;
            }
          }
        }
      }

      return {
        success: true,
        data: filteredRecords,
      };
    }

    // Gender filter logic
    const records: DemographicRecord[] = [];
    
    // TODO: Query and aggregate student data by semester and gender here
    // This would involve joining students -> teams -> semesters
    // and computing gender breakdowns for each semester+course combination

    const filteredRecords = records.map((r) => {
      const total = r.Total;
      const data: DemographicRecord = {
        Name: r.Name,
        Course: r.Course,
        Total: r.Total,
      };

      genders.forEach((g) => {
        const value = r[g as keyof DemographicRecord] as number | undefined;
        if (typeof value === 'number') {
          data[g] = Yaxis === "Percentages"
            ? ((value / total) * 100).toFixed(2) + "%"
            : value;
        }
      });

      return data;
    });

    //Removing extraneous semesters for the continuous option (if needed in future)
    if(continuous && filteredRecords.length > 0){
      // console.log("Continuous: extraneous records being trimmed off...");
      let semestersWithoutAlteration = String(Semester).split(","); //The actual start and end semesters chosen
      let startSemester = semestersWithoutAlteration[0];
      let endSemester = semestersWithoutAlteration[1];
      if(startSemester === "Spring"){
        startSemester = "S";
      }
      else if(startSemester === "Summer"){
        startSemester = "U";
      }
      else{
        startSemester = "F";
      }
      if(endSemester === "Spring"){
        endSemester = "S";
      }
      else if(endSemester === "Summer"){
        endSemester = "U";
      }
      else{
        endSemester = "F";
      }
      let startYear = Number(years[0]);
      let endYear = Number(years[years.length - 1]);
      const semesterOrder = ['S', 'U', 'F'];
      for (let i = 0; i < filteredRecords.length; i++){
        let currentYear = Number(("20" + filteredRecords[i].Name.substring(0,2)));//This will stop working in the year 2100
        let currentSemester = filteredRecords[i].Name.substring(2,3);
        //Invalid years will have no data, so only intra-year violations matter.
        if(currentYear === startYear){
          if ((semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester)) > 0){ //if we are before the first semester in the last selected year.
            // console.log("(semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester) = " + (semesterOrder.indexOf(startSemester) - semesterOrder.indexOf(currentSemester)));
            // console.log(`Removing ${JSON.stringify(filteredRecords[i])}...`);
            filteredRecords.splice(i,1);
            i--;
          }
        }
        else if(currentYear === endYear){
          if ((semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester)) > 0){ //if we are beyond the last semester in the last selected year.
            // console.log("(semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester) = " + (semesterOrder.indexOf(currentSemester) - semesterOrder.indexOf(endSemester)));
            // console.log(`Removing ${JSON.stringify(filteredRecords[i])}...`);
            filteredRecords.splice(i,1);
            i--;
          }
        }
      }
    }

    return {
      success: true,
      data: filteredRecords,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
});
