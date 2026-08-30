import crypto from "node:crypto";

const KEY_LENGTH = 64;

/**
 * Hashes a password with a random salt.
 * Returns "salt:hash" so you can verify later without storing salt separately.
 */
export function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString("hex");

        crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
            if (error) reject(error);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
}

/**
 * Verifies a plaintext password against a stored "salt:hash" string.
 */
export function verifyPassword(password, storedHash) {
    return new Promise((resolve, reject) => {
        const [salt, originalHash] = storedHash.split(":");

        crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
            if (error) reject(error);
            resolve(derivedKey.toString("hex") === originalHash);
        });
    });
}