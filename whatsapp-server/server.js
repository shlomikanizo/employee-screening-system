/**
 * WhatsApp Web Server
 * שרת Node.js עם whatsapp-web.js
 * חלופה חינמית ל-WhatsApp Business API
 */

const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json({ limit: '50mb' }));

// יצירת WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let isReady = false;
let qrCodeData = null;

// Event: QR Code
client.on('qr', (qr) => {
    console.log('📱 סרוק את קוד ה-QR עם WhatsApp:');
    qrcode.generate(qr, { small: true });
    qrCodeData = qr;
});

// Event: Ready
client.on('ready', () => {
    console.log('✅ WhatsApp Client מוכן!');
    isReady = true;
    qrCodeData = null;
});

// Event: Authenticated
client.on('authenticated', () => {
    console.log('🔐 אומת בהצלחה!');
});

// Event: Auth Failure
client.on('auth_failure', (msg) => {
    console.error('❌ כשל באימות:', msg);
});

// Event: Disconnected
client.on('disconnected', (reason) => {
    console.log('⚠️ נותק:', reason);
    isReady = false;
});

// Event: Message (אופציונלי - לקבלת הודעות)
client.on('message', async (message) => {
    console.log('📨 הודעה חדשה:', message.from, message.body);
});

// אתחול ה-Client
console.log('🚀 מאתחל WhatsApp Client...');
client.initialize();

// ===== API Routes =====

// בדיקת סטטוס
app.get('/status', (req, res) => {
    res.json({
        connected: isReady,
        hasQR: qrCodeData !== null,
        qrCode: qrCodeData,
        timestamp: new Date().toISOString()
    });
});

// קבלת QR Code
app.get('/qr', (req, res) => {
    if (qrCodeData) {
        res.json({
            success: true,
            qrCode: qrCodeData
        });
    } else if (isReady) {
        res.json({
            success: true,
            message: 'Already connected'
        });
    } else {
        res.json({
            success: false,
            message: 'QR code not ready yet'
        });
    }
});

// שליחת הודעה
app.post('/send-message', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not ready'
            });
        }

        const { chatId, message } = req.body;

        if (!chatId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing chatId or message'
            });
        }

        console.log(`📤 שולח הודעה ל-${chatId}`);
        
        const result = await client.sendMessage(chatId, message);
        
        console.log('✅ הודעה נשלחה בהצלחה');
        
        res.json({
            success: true,
            id: result.id._serialized,
            timestamp: result.timestamp,
            to: chatId
        });

    } catch (error) {
        console.error('❌ שגיאה בשליחת הודעה:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// שליחת קובץ
app.post('/send-file', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not ready'
            });
        }

        const { chatId, fileData, fileName, caption } = req.body;

        if (!chatId || !fileData) {
            return res.status(400).json({
                success: false,
                error: 'Missing chatId or fileData'
            });
        }

        console.log(`📎 שולח קובץ ל-${chatId}: ${fileName}`);

        // המרה מ-base64 לקובץ זמני
        const buffer = Buffer.from(fileData, 'base64');
        const tempPath = `./temp_${Date.now()}_${fileName}`;
        fs.writeFileSync(tempPath, buffer);

        // שליחת הקובץ
        const media = require('whatsapp-web.js').MessageMedia.fromFilePath(tempPath);
        const result = await client.sendMessage(chatId, media, { caption: caption || '' });

        // מחיקת הקובץ הזמני
        fs.unlinkSync(tempPath);

        console.log('✅ קובץ נשלח בהצלחה');

        res.json({
            success: true,
            id: result.id._serialized,
            timestamp: result.timestamp,
            to: chatId
        });

    } catch (error) {
        console.error('❌ שגיאה בשליחת קובץ:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// בדיקת תקינות מספר
app.post('/check-number', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not ready'
            });
        }

        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Missing phoneNumber'
            });
        }

        const numberId = await client.getNumberId(phoneNumber);

        res.json({
            success: true,
            exists: numberId !== null,
            numberId: numberId
        });

    } catch (error) {
        console.error('❌ שגיאה בבדיקת מספר:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// התנתקות
app.post('/logout', async (req, res) => {
    try {
        await client.logout();
        isReady = false;
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('❌ שגיאה בהתנתקות:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        connected: isReady,
        uptime: process.uptime()
    });
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`\n🚀 WhatsApp Web Server רץ על http://localhost:${PORT}`);
    console.log(`📊 בדוק סטטוס: http://localhost:${PORT}/status`);
    console.log(`🔍 בדיקת בריאות: http://localhost:${PORT}/health`);
    console.log('\n⏳ ממתין לסריקת QR code...\n');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏹️  מכבה את השרת...');
    await client.destroy();
    process.exit(0);
});
