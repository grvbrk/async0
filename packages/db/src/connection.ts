import { pool } from "./db";

export async function connectDB() {
  if (!pool._pool) {
    try {
      await pool.connect({
        host: process.env.POSTGRES_CONFIG_HOST,
        port: Number(process.env.POSTGRES_CONFIG_PORT),
        database: process.env.POSTGRES_CONFIG_DATABASE,
        user: process.env.POSTGRES_CONFIG_USER,
        password: process.env.POSTGRES_CONFIG_PASSWORD,
      });
      console.log("DB connected");
    } catch (error) {
      console.log("ERROR CONNECTING TO DB IN CONNECTION.TS");
    }
  }
}
