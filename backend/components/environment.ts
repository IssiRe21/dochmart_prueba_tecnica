// Cargar variables de entorno desde .env
import 'dotenv/config';

// ---TODO: add to .env---
// DATABASE_HOST="locahost"
// DATABASE_NAME="dochmart_prueba_tecnica"
// DATABASE_USERNAME="dochmart"
// DATABASE_PASSWORD="123"
// SERVER_PORT=3000
// JWT_SECRET="JWT_SECRET"
// CORS_CLIENT_ORIGIN="http://localhost:4200"
// USER_REPORT_URL="http://localhost:8000"

export default {
    database: {
        host: process.env.DATABASE_HOST as string,
        name: process.env.DATABASE_NAME as string,
        username: process.env.DATABASE_USERNAME as string,
        password: process.env.DATABASE_PASSWORD as string,
    },
    server: {
        port: (process.env.SERVER_PORT || 3000) as number
    },
    jwt: {
        secret: (process.env.JWT_SECRET || 'JWT_SECRET') as string,
    },
    cors: {
        clientOrigin: (process.env.CORS_CLIENT_ORIGIN || 'http://localhost:4200') as string,
    },
    services: {
        userReportUrl: (process.env.USER_REPORT_URL || 'http://localhost:8000') as string,
    },
} as const;