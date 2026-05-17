import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3333;
const API_KEY = process.env.GATEWAY_API_KEY || 'mister-churras-secret-2024';

let sock: any = null;
let lastQR: string | null = null;
let isConnected = false;

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
        browser: ['Mister Churras Gateway', 'Chrome', '1.0.0'],
    });

    sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            lastQR = qr;
            isConnected = false;
            console.log('--- NEW QR CODE GENERATED --- Scan at /qr ---');
            qrcode.generate(qr, { small: true });
            try {
                await QRCode.toFile(path.join(process.cwd(), 'qr.png'), qr);
            } catch (err) {
                console.error('Failed to save QR Code to file', err);
            }
        }

        if (connection === 'close') {
            isConnected = false;
            lastQR = null;
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            isConnected = true;
            lastQR = null;
            console.log('✅ WhatsApp Connected - Mister Churras Gateway is Ready!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

// ─── Middleware ────────────────────────────────────────────────────────────────
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Middleware for web pages (GET) - protects /qr, /reset, /status, / from unauthorized users
const authenticateWeb = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.query.key;
    if (key !== API_KEY) {
        return res.status(401).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🔒 Acesso Restrito - Mister Churras</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Old+Standard+TT&display=swap');
    body { font-family: 'Old Standard TT', serif; background: #1a0e08; color: #f4ecd8; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
    h1 { font-family: 'Cinzel', serif; color: #8e2b0c; font-size: 2.5rem; letter-spacing: 0.05em; margin-bottom: 1rem; }
    p { color: #c4a882; font-size: 1.2rem; max-width: 500px; line-height: 1.6; }
    .footer { margin-top: 2rem; color: #7a6050; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>🔒 Acesso Negado</h1>
  <p>Este portal de gerenciamento do Gateway WhatsApp do <strong>Mister Churras</strong> é restrito apenas a administradores autorizados.</p>
  <div class="footer">Segurança por: Guardião da Brasa (OWASP / NIST Frameworks)</div>
</body>
</html>`);
    }
    next();
};

// ─── Routes ───────────────────────────────────────────────────────────────────

/** Public health check endpoint for cloud platform checks */
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

/** Home — connection status dashboard (Public for Render Healthcheck, Admin navigation only with key) */
app.get('/', (req, res) => {
    const key = req.query.key;
    const hasValidKey = key === API_KEY;
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mister Churras Gateway</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Old+Standard+TT&display=swap');
    body { font-family: 'Old Standard TT', serif; background: #1a0e08; color: #f4ecd8; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    h1 { font-family: 'Cinzel', serif; color: #8e2b0c; font-size: 2rem; letter-spacing: 0.1em; }
    .badge { padding: 0.75rem 2rem; border-radius: 4px; font-size: 1.1rem; margin: 1.5rem 0; font-weight: bold; }
    .online { background: rgba(0,180,0,0.15); border: 2px solid #2ecc71; color: #2ecc71; }
    .offline { background: rgba(200,50,0,0.15); border: 2px solid #8e2b0c; color: #e74c3c; }
    a { color: #d4a017; text-decoration: none; border-bottom: 1px dotted #d4a017; }
    a:hover { color: #f0c040; }
    p { color: #c4a882; }
  </style>
</head>
<body>
  <h1>🔥 Mister Churras Gateway</h1>
  <div class="badge ${isConnected ? 'online' : 'offline'}">
    ${isConnected ? '✅ WhatsApp Conectado e Pronto' : '⚠️ WhatsApp Desconectado'}
  </div>
  ${!isConnected && hasValidKey ? `<p>👉 <a href="/qr?key=${key}">Clique aqui para escanear o QR Code</a></p>` : ''}
  ${hasValidKey ? `<p><a href="/status?key=${key}">/status JSON</a></p>` : ''}
</body>
</html>`;
    res.send(html);
});

/** QR Code page — auto-refreshes until connected */
app.get('/qr', authenticateWeb, async (req, res) => {
    const key = req.query.key;
    if (isConnected) {
        return res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Conectado!</title>
<style>body{font-family:serif;background:#1a0e08;color:#f4ecd8;text-align:center;padding:3rem}</style>
</head>
<body><h1>✅ WhatsApp já está conectado!</h1>
<p>O gateway está online. Feche esta janela.</p>
<p><a href="/?key=${key}" style="color:#d4a017">← Voltar ao dashboard</a></p>
</body></html>`);
    }

    if (!lastQR) {
        return res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta http-equiv="refresh" content="3"><title>Aguardando QR...</title>
<style>body{font-family:serif;background:#1a0e08;color:#f4ecd8;text-align:center;padding:3rem}</style>
</head>
<body><h1>🔄 Gerando QR Code...</h1>
<p>Aguarde. Esta página atualiza automaticamente.</p>
</body></html>`);
    }

    try {
        const qrDataUrl = await QRCode.toDataURL(lastQR, { width: 280, margin: 2 });
        return res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="25">
  <title>Escanear QR - Mister Churras</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Old+Standard+TT&display=swap');
    body { font-family: 'Old Standard TT', serif; background: #1a0e08; color: #f4ecd8; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
    h1 { font-family: 'Cinzel', serif; color: #8e2b0c; }
    img { border: 10px solid #f4ecd8; border-radius: 8px; display: block; }
    ol { text-align: left; color: #c4a882; max-width: 320px; line-height: 1.8; }
    small { color: #7a6050; }
  </style>
</head>
<body>
  <h1>🔥 Vincular WhatsApp</h1>
  <img src="${qrDataUrl}" alt="QR Code WhatsApp" />
  <ol>
    <li>Abra o WhatsApp no seu celular</li>
    <li>Menu (⋮) → <strong>Dispositivos vinculados</strong></li>
    <li>Toque em <strong>Vincular um dispositivo</strong></li>
    <li>Aponte a câmera para este QR Code</li>
  </ol>
  <small>QR Code expira em ~60s. Página atualiza automaticamente.</small>
  <br/><br/>
  <p><a href="/reset?key=${key}" style="color: #e67e22; text-decoration: none; border: 1px dashed #e67e22; padding: 0.5rem 1rem; border-radius: 4px; font-weight: bold;">🔄 Problemas ao vincular? Clique aqui para Resetar a Sessão</a></p>
</body>
</html>`);
    } catch (_err) {
        return res.status(500).send('Erro ao gerar QR code. Verifique os logs.');
    }
});

/** Reset session and recreate WhatsApp connection */
app.get('/reset', authenticateWeb, async (req, res) => {
    const key = req.query.key;
    try {
        console.log('🔄 Resetting WhatsApp session...');
        
        // 1. Close current socket connection if it exists
        if (sock) {
            try {
                sock.end(undefined);
            } catch (err) {
                console.warn('Error ending socket:', err);
            }
        }
        
        isConnected = false;
        lastQR = null;
        sock = null;
        
        // 2. Wait a moment for files to unlock
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 3. Delete credentials directory
        const sessionPath = path.join(process.cwd(), 'sessions/mister-churras');
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            console.log('🗑️ Session directory deleted.');
        }
        
        // 4. Reconnect fresh
        connectToWhatsApp();
        
        // 5. Redirect back to /qr to scan new code
        res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta http-equiv="refresh" content="3;url=/qr?key=${key}"><title>Reiniciando...</title>
<style>body{font-family:serif;background:#1a0e08;color:#f4ecd8;text-align:center;padding:3rem}</style>
</head>
<body><h1>🔄 Sessão Reiniciada com Sucesso!</h1>
<p>Apagamos os dados antigos. Redirecionando para o novo QR Code em 3 segundos...</p>
<p><a href="/qr?key=${key}" style="color:#d4a017">Clique aqui se não for redirecionado automaticamente</a></p>
</body></html>`);
    } catch (err: any) {
        console.error('Failed to reset session:', err);
        res.status(500).send(`Erro ao resetar sessão: ${err.message}`);
    }
});

/** Send a WhatsApp message — protected by API key */
app.post('/send', authenticate, async (req, res) => {
    const { number, text } = req.body;

    if (!number || !text) {
        return res.status(400).json({ error: 'number and text are required' });
    }

    if (!sock || !isConnected) {
        return res.status(503).json({
            error: 'WhatsApp not connected',
            hint: 'Scan QR code at /qr endpoint first'
        });
    }

    try {
        const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text });
        res.json({ success: true, message: 'Mensagem enviada!' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/** Status endpoint — used by Railway health check */
app.get('/status', authenticateWeb, (req, res) => {
    res.json({
        online: isConnected,
        qr_available: !!lastQR,
        user: sock?.user?.id || null,
        qr_url: !isConnected ? `/qr?key=${req.query.key}` : null
    });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Mister Churras Gateway running on port ${PORT}`);
    connectToWhatsApp();
});
