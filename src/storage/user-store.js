import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(
    __dirname,
    "../../data/users.json"
);

export async function readUsers() {
    try {
        const data = await fs.readFile(
            USERS_FILE,
            "utf-8"
        );

        // File exists but is empty
        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        // File doesn't exist
        if (error.code === "ENOENT") {
            await fs.writeFile(
                USERS_FILE,
                "[]",
                "utf-8"
            );

            return [];
        }

        throw error;
    }
}

export async function writeUsers(users) {
    await fs.writeFile(
        USERS_FILE,
        JSON.stringify(users, null, 2),
        "utf-8"
    );
}