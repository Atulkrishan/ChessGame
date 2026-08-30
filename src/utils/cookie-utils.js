/**
 * Parses the raw Cookie header into a plain object.
 */
export function parseCookies(req) {
    const cookieHeader = req.headers.cookie;
    const cookies = {};

    if (!cookieHeader) return cookies;

    cookieHeader.split(";").forEach((pair) => {
        const [key, ...valueParts] = pair.trim().split("=");
        cookies[key] = decodeURIComponent(valueParts.join("="));
    });

    return cookies;
}

/**
 * Builds a Set-Cookie header value for the session.
 */
export function buildSessionCookie(sessionId) {
    return `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`;
}

/**
 * Builds a Set-Cookie header that clears the session (used on logout).
 */
export function clearSessionCookie() {
    return `sessionId=; HttpOnly; Path=/; Max-Age=0`;
}