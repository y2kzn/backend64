const axios = require('axios');
const path = require('path');

class WebhookModules {
    static lastAlertTime = 0;
    
    static async sendAlert(details) {
        const webhookUrl = process.env.WEBHOOK_URL_ALERT;
        if (!webhookUrl) return;
        
        const now = Date.now();
        if (now - this.lastAlertTime < 10000) {
            console.log("[WEBHOOK] Alerta ignorado devido ao Cooldown.");
            return;
        }
        this.lastAlertTime = now;
        
        let color = 3066993;
        let emoji = "ℹ️";
        
        if (details.level === 'CRITICAL') {
            color = 15158332;
            emoji = "🚨";
        } else if (details.level === 'WARNING') {
            color = 15105570;
            emoji = "⚠️";
        }
        
        const imageUrl ="https://cdn.discordapp.com/icons/1520542002847023204/5994dc339444c9fc63a5e3cec40cf022.png?size=2048"
        
        const embed = {
            author: {
                name: `${emoji} ${details.title || "System Alert"}`,
                icon_url: imageUrl
            },
            description: `**Event:** \`${details.reason}\`\n**Path:** \`${details.path}\``,
            color: color,
            fields: [
                { name: "IP Address", value: `\`${details.ip || "Unknown"}\``, inline: true }
            ],
            footer: { 
                text: "Stumble Pole Shield System", 
                icon_url: imageUrl
            },
            timestamp: new Date()
        };
        
        if (details.deviceId) {
            embed.fields.push({ name: "Device ID", value: `\`${details.deviceId}\``, inline: false });
        }
        if (details.stumbleId) {
            embed.fields.push({ name: "Stumble ID", value: `\`${details.stumbleId}\``, inline: true });
        }
        
        try {
            await axios.post(webhookUrl, { embeds: [embed] });
        } catch (err) {
            console.error("Erro ao enviar Webhook para o Discord:", err.message);
        }
    }
}

module.exports = WebhookModules;