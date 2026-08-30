import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSIONS_FILE = path.join(
    __dirname,
    "../../data/sessions.json"
);

export async function readSessions() {
    try {
        const data = await fs.readFile(SESSIONS_FILE, "utf-8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(
                SESSIONS_FILE,
                "[]",
                "utf-8"
            );

            return [];
        }

        throw error;
    }
}

export async function writeSessions(sessions) {
    await fs.writeFile(
        SESSIONS_FILE,
        JSON.stringify(sessions, null, 2),
        "utf-8"
    );
}