import pg from "pg";

const pool = new pg.Pool({
    user: process.env.USER_DB,
    database: process.env.DATABASE_DB,
    host: process.env.HOST_DB,
    password: process.env.PASSWORD_DB,
    port:process.env.PORT_DB,
  });

export default pool;