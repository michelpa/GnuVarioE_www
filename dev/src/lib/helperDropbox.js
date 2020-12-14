function regenerateRandomString() {
    return Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36);
}

function base64Encode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export function getCodeChallenge(codeVerifier) {
    const hexstr = sha256.arrayBuffer(codeVerifier)
    const codeChallenge = base64Encode(Buffer.from(hexstr));
    return codeChallenge;
}

export function getCodeVerifier() {
    return base64Encode(regenerateRandomString());
}
