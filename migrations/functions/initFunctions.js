import { readFile } from 'fs/promises';
import path from 'path';
import pool from '../../config/databases.js';
 
const sqlFiles = [
    "check_middleware_administrateur.sql",
    'check_middleware_organization.sql',
    'check_middleware_owner.sql',
    'create_user.sql',
    'create_address.sql', 
    'create_destination.sql',
    'create_organization.sql',
    'get_auth_by_email.sql', 
    'create_event.sql',
    'get_user_info_by_auth_id.sql',
    'get_user_info_by_user_id.sql', 
    'get_organization_by_id.sql',
    'get_destinations.sql',
    'get_event_by_id.sql',
    'get_user_info.sql',
    'get_all_events_active_by_organization_id.sql',
    'delete_destination.sql',
    'update_user_info.sql',
    'submit_event.sql',
    'cancel_submit_event.sql',
    'cancel_event.sql',
    'delete_event.sql',
    'add_user_to_organization.sql',
    'remove_user_from_organization.sql'
];
 
const initFunctions = async () => {
    console.log("🚀 Initialisation des Functions...");
    try {
        for (const file of sqlFiles) { 
            console.log('query :', file);
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