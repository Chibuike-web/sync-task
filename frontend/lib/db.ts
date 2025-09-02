import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

export async function openDB() {
	return open({
		filename: "./prisma/db.sqlite",
		driver: sqlite3.Database,
	});
}
