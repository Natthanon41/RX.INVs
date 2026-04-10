const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
    const config = {
        host: 'localhost',
        port: 3308,
        user: 'root',
        password: '',
        database: 'invs'
    };
    
    try {
        const connection = await mysql.createConnection(config);
        const coreTables = ['drug_vn', 'ms_po', 'ms_po_c', 'dispensed', 'req_con', 'med_inv', 'company'];
        let schemaInfo = '--- INVS CORE TABLES SCHEMA ---\n\n';
        
        for (const table of coreTables) {
            schemaInfo += `TABLE: ${table}\n`;
            try {
                const [columns] = await connection.query(`DESCRIBE ${table}`);
                columns.forEach(col => {
                    schemaInfo += `  - ${col.Field} (${col.Type})\n`;
                });
                schemaInfo += '\n';
            } catch (err) {
                schemaInfo += `  Error getting schema: ${err.message}\n\n`;
            }
        }
        
        fs.writeFileSync('core_schema.txt', schemaInfo);
        console.log('Schema dumped to core_schema.txt');
        await connection.end();
    } catch (err) {
        console.error('Connection failed:', err.message);
        fs.writeFileSync('core_schema.txt', 'CONNECTION FAILED: ' + err.message);
    }
}

main();
