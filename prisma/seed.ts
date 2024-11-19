import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const rows = [
    {Name: "19F", Course: "2200", Year:"2019", Sem: "Fall", African_American: 4, Asian: 21, Hispanic: 6, International: 16, Other: 6, White: 10, Male: 45, Female: 18, Total: 63},
    {Name: "20S", Course: "2200", Year:"2020", Sem: "Spring", African_American: 4, Asian: 33, Hispanic: 12, International: 11, Other: 6, White: 17, Male: 59, Female: 24, Total: 83},
    {Name: "20F", Course: "2200", Year:"2020", Sem: "Fall",African_American: 1, Asian: 29, Hispanic: 6, International: 7, Other: 0, White: 12, Male: 43, Female: 12, Total: 55},
    {Name: "21S", Course: "2200", Year:"2021", Sem: "Spring",African_American: 2, Asian: 43, Hispanic: 11, International: 6, Other: 5, White: 13, Male: 55, Female: 25, Total: 80},
    {Name: "21F", Course: "2200", Year:"2021", Sem: "Fall",African_American: 3, Asian: 33, Hispanic: 8, International: 8, Other: 4, White: 8, Male: 32, Female: 32, Total: 64},
    {Name: "22S", Course: "2200", Year:"2022", Sem: "Spring",African_American: 1, Asian: 47, Hispanic: 12, International: 11, Other: 7, White: 16, Male: 65, Female: 29, Total: 94},
    {Name: "22F", Course: "2200", Year:"2022", Sem: "Fall",African_American: 1, Asian: 42, Hispanic: 7, International: 0, Other: 5, White: 16, Male: 48, Female: 23, Total: 71},
    {Name: "23S", Course: "2200", Year:"2023", Sem: "Spring",African_American: 3, Asian: 61, Hispanic: 25, International: 5, Other: 8, White: 12, Male: 72, Female: 42, Total: 114},
    {Name: "23F", Course: "2200", Year:"2023", Sem: "Fall",African_American: 5, Asian: 66, Hispanic: 14, International: 14, Other: 8, White: 7, Male: 76, Female: 38, Total: 114},
    {Name: "24S", Course: "2200", Year:"2024", Sem: "Spring",African_American: 7, Asian: 76, Hispanic: 6, International: 15, Other: 7, White: 10, Male: 77, Female: 44, Total: 121},
    {Name: "24U", Course: "2200", Year:"2024", Sem: "Summer",African_American: 3, Asian: 4, Hispanic: 0, International: 2, Other: 0, White: 1, Male: 6, Female: 4, Total: 10},
    {Name: "19F", Course: "3200", Year:"2019", Sem: "Fall",African_American: 2, Asian: 8, Hispanic: 3, International: 2, Other: 0, White: 1, Male: 12, Female: 4, Total: 16},
    {Name: "20S", Course: "3200", Year:"2020", Sem: "Spring",African_American: 1, Asian: 6, Hispanic: 1, International: 2, Other: 0, White: 2, Male: 7, Female: 5, Total: 12},
    {Name: "20F", Course: "3200", Year:"2020", Sem: "Fall",African_American: 2, Asian: 2, Hispanic: 0, International: 0, Other: 1, White: 0, Male: 3, Female: 2, Total: 5},
    {Name: "21S", Course: "3200", Year:"2021", Sem: "Spring",African_American: 1, Asian: 6, Hispanic: 2, International: 3, Other: 0, White: 3, Male: 12, Female: 3, Total: 15},
    {Name: "21F", Course: "3200", Year:"2021", Sem: "Fall",African_American: 1, Asian: 2, Hispanic: 0, International: 0, Other: 0, White: 1, Male: 3, Female: 1, Total: 4},
    {Name: "22S", Course: "3200", Year:"2022", Sem: "Spring",African_American: 2, Asian: 6, Hispanic: 0, International: 0, Other: 0, White: 0, Male: 5, Female: 3, Total: 8},
    {Name: "22F", Course: "3200", Year:"2022", Sem: "Fall",African_American: 0, Asian: 1, Hispanic: 2, International: 1, Other: 0, White: 1, Male: 3, Female: 2, Total: 5},
    {Name: "23S", Course: "3200", Year:"2023", Sem: "Spring",African_American: 0, Asian: 7, Hispanic: 1, International: 0, Other: 2, White: 3, Male: 10, Female: 3, Total: 13},
    {Name: "23F", Course: "3200", Year:"2023", Sem: "Fall",African_American: 0, Asian: 8, Hispanic: 2, International: 1, Other: 2, White: 3, Male: 13, Female: 3, Total: 16},
    {Name: "24S", Course: "3200", Year:"2024", Sem: "Spring",African_American: 2, Asian: 15, Hispanic: 1, International: 1, Other: 2, White: 3, Male: 6, Female: 18, Total: 24},
    {Name: "24U", Course: "3200", Year:"2024", Sem: "Summer",African_American: 1, Asian: 0, Hispanic: 1, International: 1, Other: 0, White: 0, Male: 1, Female: 2, Total: 3}
]

const main = async() => {
    try {
        const results = await prisma.semester.createMany({
            data: rows
        });
        console.log(results.count)

    } catch(error) {
        console.log(error)
    }
}

main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})
    