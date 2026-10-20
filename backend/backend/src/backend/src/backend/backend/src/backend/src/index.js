import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { config } from './config.js';
import { errorHandler } from './middleware.js';
import { authRouter } from './routes/auth.js';
import { productRouter } from './routes/products.js';
import { orderRouter } from './routes/orders.js';
import { paymentRouter, webhookRouter } from './routes/payments.js';
import { adminRouter } from './routes/admin.js';

const app = express();
const server = http.createServer(app);
app.use(cors({ origin: config.frontendUrl }));
app.use('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => { req.body = JSON.parse(req.body.toString() || '{}'); next(); });
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/admin', adminRouter);
app.use('/webhook', webhookRouter);
app.use(errorHandler);

const io = new SocketServer(server, { cors: { origin: config.frontendUrl } });
app.set('io', io);
server.listen(config.port, () => console.log('Server running on port ' + config.port));
