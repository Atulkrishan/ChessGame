import crypto from "node:crypto";

// sessionId -> { userId, createdAt }
const sessions = new Map();

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createSession(userId) {
    const sessionId = crypto.randomBytes(32).toString("hex");

    sessions.set(sessionId, {
        userId,
        createdAt: Date.now()
    });

    return sessionId;
}

export function getSession(sessionId) {
    const session = sessions.get(sessionId);

    if (!session) return null;

    // Expire old sessions
    if (Date.now() - session.createdAt > SESSION_DURATION_MS) {
        sessions.delete(sessionId);
        return null;
    }

    return session;
}

export function destroySession(sessionId) {
    sessions.delete(sessionId);
}