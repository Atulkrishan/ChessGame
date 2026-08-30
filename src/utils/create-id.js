import crypto from "node:crypto";

export function createId() {
    return crypto.randomUUID();
}