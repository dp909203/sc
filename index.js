import config from './src/config/config.js';
import app from "./src/app.js";
import https from 'https';
import http from 'http';
import fs from 'fs';

let server;
if (config.protocol === 'https') {

    server = https.createServer(
        {
            key: fs.readFileSync(config.certificates.privkey, 'utf8'),
            cert: fs.readFileSync(config.certificates.fullchain, 'utf8')
        },
        app
    );
} else {
    server = http.createServer(app);
}

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});