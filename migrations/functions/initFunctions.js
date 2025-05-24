import { readFile } from 'fs/promises';
import path from 'path';
import pool from '../../config/databases.js';
import { sqlFiles } from './functionsList.js';

 
const initFunctions = async () => {
    console.log("🚀 Initialisation des Functions...");
    try {
        for (const file of sqlFiles) { 
            const filePath = path.join('migrations/functions', file);
            const query = await readFile(filePath, 'utf-8');
            console.log(' query ✅');
            await pool.query(query);
             
        }   
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des functions :", error);
        process.exit(1);
    }   
};   

export default initFunctions;