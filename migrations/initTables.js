import { readFile } from 'fs/promises';
import path from 'path';
import pool from '../config/databases.js';

const sqlFiles = ['enums.sql','users.sql',"destinations.sql", 'events.sql', 'organizations.sql', "address.sql", "auth.sql", "submits.sql", "alterTable.sql"];

const initTables = async () => {
    console.log("🚀 Initialisation des ENUMs et tables...");
    try {
        for (const file of sqlFiles) { 
            const filePath = path.join('migrations', file);
            const query = await readFile(filePath, 'utf-8');
            await pool.query(query); 
            console.log(`✅ Fichier exécuté : ${file}`);
        }   
        console.log("✅ Toutes les tables et ENUMs sont vérifiés/créés !");
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des tables :", error);
        process.exit(1);
    }   
};   

export default initTables;