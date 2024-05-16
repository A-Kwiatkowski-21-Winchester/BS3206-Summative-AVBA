import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

const userIDCookie = "user-id"
const sessionTokenCookie = "session-token"

/**
 * Gets the user ID stored in the cookie
 */
export function getUserID() {
    return cookies.get(userIDCookie);
}

/**
 * Gets the session token stored in the cookie
 */
export function getToken() {
    return cookies.get(sessionTokenCookie);
}

/**
 * Clears both the user ID and session token cookies
 */
export function clearCookies() {
    cookies.remove(userIDCookie)
    cookies.remove(sessionTokenCookie)
}

