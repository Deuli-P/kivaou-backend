import { readFile } from 'fs/promises';
import path from 'path';
import pool from '../config/databases.js';

// Fonction qui charge un fichier SQL et l'exécute avec des paramètres
const executeQuery = async (sqlFilePath, values = []) => {
    try { 
        const query = await readFile(path.resolve(sqlFilePath), 'utf-8');
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error(`❌ Erreur lors de l'exécution de la requête ${sqlFilePath} :`, error);
        throw error;
    }
};

export default executeQuery;