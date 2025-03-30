import { readFile } from 'fs/promises';
import path from 'path';
import pool from '../../config/databases.js';

const sqlFiles = [
    'create_user.sql',
    'get_auth_by_email.sql', 
    'get_user_info_by_auth_id.sql',
    'get_user_info_by_user_id.sql', 
    'create_organization.sql',
    'update_user_info.sql'
];

const initFunctions = async () => {
    console.log("🚀 Initialisation des Functions...");
    try {
        for (const file of sqlFiles) { 
            const filePath = path.join('migrations/functions', file);
            const query = await readFile(filePath, 'utf-8');
            await pool.query(query);
        }   
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des functions :", error);
        process.exit(1);
    }   
};   

export default initFunctions;