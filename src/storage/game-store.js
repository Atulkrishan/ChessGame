import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_FILE = path.join(
    __dirname,
    "../../data/games.json"
);

export async function readGames() {
    try {
        const data = await fs.readFile(
            GAMES_FILE,
            "utf-8"
        );

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(
                GAMES_FILE,
                "[]",
                "utf-8"
            );

            return [];
        }

        throw error;
    }
}

export async function writeGames(games) {
    await fs.writeFile(
        GAMES_FILE,
        JSON.stringify(games, null, 2),
        "utf-8"
    );
}