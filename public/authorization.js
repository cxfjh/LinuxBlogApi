const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = 'fengjiheng-_-//bloi';

// 生成加密 token
const encryptToken = (payload, secret) => {
    const key = crypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// 解密 token
const decryptToken = (encryptedToken, secret) => {
    const [ivHex, encrypted] = encryptedToken.split(':');
    const key = crypto.createHash('sha256').update(secret).digest('base64').substring(0, 32);
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
};

// 验证 token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) { return res.status(401).json({ error: '暂未登录！' }); }
    try {
        let decryptedToken = decryptToken(token, secret);
        decryptedToken = decryptedToken.replace(/\"/g, "");
        jwt.verify(decryptedToken, secret);
        next();
    } catch (err) { return res.status(401).json({ error: '验证失败！' }); }
};

// 生成 JWT token
const generateToken = (payload, secret, expiresIn) => {
    const token = jwt.sign(payload, secret, { expiresIn });
    const encryptedToken = encryptToken(token, secret);
    return encryptedToken;
};

module.exports = {
    verifyToken,
    generateToken,
    secret
}