import { readFile } from 'fs/promises';
import path from 'path';
import pool from '../../config/databases.js';

const sqlFiles = ['enums.sql','users.sql',"destinations.sql", 'events.sql', 'organizations.sql', "address.sql", "auth.sql", "submits.sql", "alterTable.sql"];

const initTables = async () => {
    console.log("🚀 Initialisation des ENUMs et tables...");
    try {
        for (const file of sqlFiles) { 
            console.log('query :', file);
            const filePath = path.join('migrations/tables', file);
            const query = await readFile(filePath, 'utf-8');
            console.log(' query ✅');
            await pool.query(query); 
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des tables :", error);
        process.exit(1);
    }   
};   

export default initTables;