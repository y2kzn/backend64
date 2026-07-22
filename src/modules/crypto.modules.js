const crypto = require("crypto");
const jwt = require('jsonwebtoken');

class CryptoModules {
    static SessionToken() {
        const buffer = crypto.randomBytes(16)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
        
        return buffer
    }
    
    static async generatePhotonJwt(stumbleId, deviceId, username) {
        const payload = {
            stumbleId,
            deviceId,
            username
        };
        
        const secret = process.env.PhotonJwt;
        const options = { expiresIn: '30d', issuer: 'StumbleGuysPeak' };
        
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
    }
    
    static generateStumbleId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 11; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }
    
    static GenerateNewReply(res) {
        const newReply = crypto.randomBytes(64).toString("hex");
        return newReply
    }
    
    static Decrypt(text, secretKey) {
        try {
            const key = crypto.createHash('sha256').update(secretKey).digest();
            
            const textParts = text.split(':');
            if (textParts.length < 2) throw new Error("Formato de Payload inválido (faltando IV)");
            
            const iv = Buffer.from(textParts.shift(), 'hex');
            const encryptedText = Buffer.from(textParts.join(':'), 'hex');
            
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            
            return decrypted.toString();
        } catch (e) {
            console.error("Erro na descriptografia:", e.message);
            return null;
        }
    }


}

module.exports = CryptoModules;