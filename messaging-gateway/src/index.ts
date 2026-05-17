import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const logger = pino({ level: 'info' });
const PORT = process.env.PORT || 3333;
const API_KEY = process.env.GATEWAY_API_KEY || 'mister-churras-secret-2024';

let sock: any = null;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('sessions/mister-churras');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
    });

    sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('--- NEW QR CODE GENERATED ---');
            qrcode.generate(qr, { small: true });
            
            // Save as PNG for easier scanning
            try {
                await QRCode.toFile(path.join(process.cwd(), 'qr.png'), qr);
                console.log('✅ QR Code saved to qr.png');
            } catch (err) {
                console.error('Failed to save QR Code to file', err);
            }
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Connected - Mister Churras Gateway is Ready!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

// Middleware to protect API
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.post('/send', authenticate, async (req, res) => {
    const { number, text } = req.body;

    if (!number || !text) {
        return res.status(400).json({ error: 'Number and text are required' });
    }

    if (!sock) {
        return res.status(503).json({ error: 'WhatsApp not initialized' });
    }

    try {
        const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text });
        res.json({ success: true, message: 'Message sent' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/status', (req, res) => {
    res.json({ 
        online: !!sock?.user,
        user: sock?.user?.id || null
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Gateway running on http://localhost:${PORT}`);
    connectToWhatsApp();
});
