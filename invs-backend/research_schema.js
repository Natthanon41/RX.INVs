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
        const tables = ['drug_vn', 'ms_po', 'ms_po_c', 'dispensed', 'req_con', 'company', 'med_inv'];
        let output = 'DATABASE SCHEMA RESEARCH\n========================\n\n';
        
        for (const table of tables) {
            output += `TABLE: ${table}\n`;
            try {
                const [rows] = await connection.query(`DESCRIBE ${table}`);
                rows.forEach(row => {
                    output += `  - ${row.Field} (${row.Type})\n`;
                });
                output += '\n';
            } catch (e) {
                output += `  Error: ${e.message}\n\n`;
            }
        }
        
        fs.writeFileSync('schema_research.txt', output);
        await connection.end();
    } catch (e) {
        fs.writeFileSync('schema_research.txt', 'CONNECTION ERROR: ' + e.message);
    }
}

main();
