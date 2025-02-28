import { Pool } from 'pg';

const pool = new Pool({
    user: 'admin',
    host: 'localstorage',
    database: 'kivaou',
    poassword : meta.process.DB_PASSWORD,
    port: meta.process.DB_PORT
});

export default pool;