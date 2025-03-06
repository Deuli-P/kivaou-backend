import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
   connectionString: process.env.DB_URL,
  });   
 
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database:', res.rows[0].now);
    }
    pool.end();
  });


export default pool;