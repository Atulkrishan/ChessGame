import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSIONS_FILE = path.join(
    __dirname,
    "../../data/sessions.json"
);

const SESSION_DURATION = 60*60* 1000; // 1 hour

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
    const updatedSessions = sessions.map((session) => {
        // Don't recreate timestamps if the session already has them
        if (session.createdAt && session.expiresAt) {
            return session;
        }

        const createdAt = new Date();
        const expiresAt = new Date(
            createdAt.getTime() + SESSION_DURATION
        );

        return {
            ...session,
            createdAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString()
        };
    });

    await fs.writeFile(
        SESSIONS_FILE,
        JSON.stringify(updatedSessions, null, 2),
        "utf-8"
    );
}