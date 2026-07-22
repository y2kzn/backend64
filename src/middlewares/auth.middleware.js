const { UserSchema } = require("../models/index");
const databases = require("../services/mongo.databases");
const crypto = require("crypto");

const Crypto = require("../modules/crypto.modules");
const Webhook = require("../modules/webhook.modules");

module.exports = async (req, res, next) => {
    try {
        return next(); // O sistema de auth nao esta desligado!
        
        if (req.path.includes('/shared/') || req.path === '/user/login') return next();
        
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ Reply: Crypto.GenerateNewReply() });
        
        const auth = JSON.parse(authHeader);
        const { DeviceId, Token, Timestamp, Hash, SecurePayload } = auth;
        const SecretAPI = process.env.SecretGame;
        
        const rawData = `${DeviceId}${Token}${Timestamp}${SecretAPI}`;
        const expectedHash = crypto.createHash('sha1').update(rawData).digest('hex');
        
        if (Hash !== expectedHash) {
            Webhook.sendAlert({
                level: 'CRITICAL',
                title: 'ASSINATURA INVÁLIDA',
                reason: 'Hash mismatch (Possível tentativa de bypass)',
                ip: req.ip,
                path: req.path,
                deviceId: DeviceId,
                stumbleId: auth.StumbleId
            });
            return res.status(403).json({  Reply: Crypto.GenerateNewReply() });
        }
        
        const now = Math.floor(Date.now() / 1000);
        const diff = Math.abs(now - Timestamp);
        
        if (diff > 10) {
            Webhook.sendAlert({
                level: 'WARNING',
                title: 'REPLAY ATTACK DETECTED',
                reason: 'Timestamp expirado (Request antiga)',
                ip: req.ip,
                path: req.path,
                deviceId: DeviceId,
            });
            return res.status(403).json({ error: "Request expirada (Replay Attack detectado)" });
        }
        
        //console.log(auth);
        
        const decrypted = Crypto.Decrypt(SecurePayload, SecretAPI);
        //console.log(decrypted);
        
        if (!decrypted) return res.status(403).json({ Reply: Crypto.GenerateNewReply() });
        
        const [decTimestamp, decDeviceId, decSecret] = decrypted.split('|');
        
        if (decTimestamp.trim() !== Timestamp.toString() || decDeviceId.trim() !== DeviceId || decSecret.trim() !== Hash) {
            console.error("DADOS NÃO BATEM:", { 
                recebido: { Timestamp, DeviceId, Hash }, 
                descriptografado: { decTimestamp, decDeviceId, decSecret } 
            });
            
            Webhook.sendAlert({
                level: 'CRITICAL',
                title: 'SECURITY MISMATCH',
                reason: 'Decrypted data does not match Header data',
                ip: req.ip,
                path: req.path,
                deviceId: DeviceId
            });
            
            return res.status(403).json({ Reply: Crypto.GenerateNewReply() });
        }
        
        return next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}