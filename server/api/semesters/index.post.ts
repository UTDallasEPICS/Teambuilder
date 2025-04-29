import { PrismaClient, Season } from "@prisma/client"

export default defineEventHandler(async (event) => {
  const client: PrismaClient = event.context.client;

  try {
    const { season, year } = await readBody<SemesterPostBody>(event);
    const createdSemester = await client.semester.create({
      data: { season, year }
    })
  
    return { status: 201, data: createdSemester }
  } catch (error) {
    console.error(error);
    return { status: 500, message: 'Internal Server Error' };
  }
})

interface SemesterPostBody {
  season: Season;
  year: number;
}