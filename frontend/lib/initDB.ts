import { openDB } from "@/lib/db";

export async function initDB() {
	const db = await openDB();

	// Users table
	await db.run(
		`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `
	);
	// Todos table
	await db.run(`
  CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY, 
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
   FOREIGN KEY(userId) REFERENCES users(id)
  )`);
	return db;
}
