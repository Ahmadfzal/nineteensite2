import bcrypt from "bcryptjs";
import { db, adminTable } from "@workspace/db";

const password = process.argv[2] ?? "admin123";
const hash = await bcrypt.hash(password, 10);

await db.delete(adminTable);
await db.insert(adminTable).values({ passwordHash: hash });

console.log(`Admin berhasil dibuat dengan password: ${password}`);
process.exit(0);
