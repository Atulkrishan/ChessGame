import crypto from "node:crypto";

import { readUsers, writeUsers } from "../storage/user-store.js";
import {
    readSessions,
    writeSessions
} from "../storage/session-store.js";

import { sendJSON } from "../utils/api-response.js";
import { createId } from "../utils/create-id.js";






export async function register(req, res) {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
        return sendJSON(res, 400, {
            success: false,
            message: "Username, email and password are required"
        });
    }

    
    const users = await readUsers();

    
    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return sendJSON(res, 409, {
            success: false,
            message: "User already exists"
        });
    }

    
    const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    
    const user = {
        id: createId(),
        username,
        email,
        passwordHash,
        createdAt: new Date().toISOString()
    };

    
    users.push(user);

    await writeUsers(users);

    return sendJSON(res, 201, {
        success: true,
        message: "User registered successfully",
        data: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
}






export async function login(req, res) {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return sendJSON(res, 400, {
            success: false,
            message: "Email and password are required"
        });
    }

    
    const users = await readUsers();

    
    const user = users.find(
        user => user.email === email
    );

    if (!user) {
        return sendJSON(res, 401, {
            success: false,
            message: "Invalid email or password"
        });
    }

    
    const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    
    if (passwordHash !== user.passwordHash) {
        return sendJSON(res, 401, {
            success: false,
            message: "Invalid email or password"
        });
    }

    
    const sessionToken = crypto
        .randomBytes(32)
        .toString("hex");

    const session = {
        id: createId(),
        userId: user.id,
        token: sessionToken,
        createdAt: new Date().toISOString()
    };

    
    const sessions = await readSessions();

    
    sessions.push(session);

    
    await writeSessions(sessions);

    return sendJSON(res, 200, {
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token: sessionToken,
            sessionId : session.id
        }
    });
}

export async function getMe(req, res) {
    return sendJSON(res, 200, {
        success: true,
        message: "User fetched successfully",
        data: {
            user: req.user
        }
    });
}

export async function logout(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return sendJSON(res, 401, {
            success: false,
            message: "Authentication token is required"
        });
    }

    const sessions = await readSessions();

    const updatedSessions = sessions.filter(
        session => session.token !== token
    );

    await writeSessions(updatedSessions);

    return sendJSON(res, 200, {
        success: true,
        message: "Logout successful"
    });
}