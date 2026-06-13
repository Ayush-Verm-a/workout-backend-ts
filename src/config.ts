import dotenv from "dotenv";
dotenv.config();

type APIConfig = {
  port: string | undefined,
  jwtSecret: string | undefined,
}

type DBConfig = {
  url: string | undefined
}

type Config = {
  api: APIConfig,
  db: DBConfig
}

export const config: Config = {
  api: { port: process.env.PORT, jwtSecret: process.env.JWT_SECRET },
  db: { url: process.env.DATABASE_URL }
}
