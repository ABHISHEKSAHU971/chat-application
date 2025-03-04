import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { initializeWebSocket } from './websocket/socket';
import http from 'http';

import { config } from 'dotenv';
import { ChatRoute } from './routes/chat.route';
config({ path: `.env` });

export const {PORT} = process.env;

const app = new App([
    new AuthRoute(),
    new ChatRoute(),
    new UserRoute(),

]);

const server = http.createServer(app.app);

initializeWebSocket(server);

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
