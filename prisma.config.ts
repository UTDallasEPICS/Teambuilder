import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  datasourceUrl: process.env.PRISMA_DB_URL,
  migrate: {
    seed: {
      run: 'tsx prisma/seed.ts',
    },
  },
})
