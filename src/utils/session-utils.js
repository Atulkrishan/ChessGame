import crypto from "node:crypto";
import { readSessions, writeSessions } from "../storage/session-store.js";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(userId) {
    const sessionId = crypto.randomUUID();

    const sessions = await readSessions();

    const createdAt = new Date();
    const expiresAt = new Date(
        createdAt.getTime() + SESSION_DURATION_MS
    );

    const session = {
        id: sessionId,
        userId,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString()
    };

    sessions.push(session);

    await writeSessions(sessions);

    return sessionId;
}

export async function getSession(sessionId) {
    const sessions = await readSessions();

    const session = sessions.find(
        session => session.id === sessionId
    );

    if (!session) {
        return null;
    }

    if (Date.now() >= new Date(session.expiresAt).getTime()) {
        const activeSessions = sessions.filter(
            session => session.id !== sessionId
        );

        await writeSessions(activeSessions);

        return null;
    }

    return session;
}

export async function destroySession(sessionId) {
    const sessions = await readSessions();

    const activeSessions = sessions.filter(
        session => session.id !== sessionId
    );

    await writeSessions(activeSessions);
}