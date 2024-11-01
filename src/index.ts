import express, { Request, Response } from 'express';
import route from './routes/route';
import prisma from './prisma';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', route);

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('Closing Prisma connection...');
    await prisma.$disconnect();
    server.close(() => {
        console.log('Server has been shut down.');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    console.log('Closing Prisma connection...');
    await prisma.$disconnect();
    server.close(() => {
        console.log('Server has been shut down.');
        process.exit(0);
    });
});