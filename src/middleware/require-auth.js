import { parseCookies } from "../utils/cookie-utils.js";
import { getSession } from "../utils/session-utils.js";
import { readUsers } from "../storage/user-store.js";
import { sendJSON } from "../utils/api-response.js";

export async function requireAuth(req, res) {
    const cookies = parseCookies(req);

    const sessionId = cookies.sessionId;

    if (!sessionId) {
        sendJSON(res, 401, {
            success: false,
            message: "Authentication required"
        });

        return false;
    }

    const session = await getSession(sessionId);

    if (!session) {
        sendJSON(res, 401, {
            success: false,
            message: "Invalid or expired session"
        });

        return false;
    }

    const users = await readUsers();

    const user = users.find(
        user => user.id === session.userId
    );

    if (!user) {
        sendJSON(res, 401, {
            success: false,
            message: "User not found"
        });

        return false;
    }

    // Store authenticated user and session on request
    req.user = user;
    req.session = session;

    return true;
}