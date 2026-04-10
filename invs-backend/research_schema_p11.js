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
        const tables = ['ms_po', 'ms_po_c', 'dispensed', 'req_con', 'med_inv', 'company'];
        let output = '--- PHASE 11 SCHEMA RESEARCH ---\n\n';
        
        for (const table of tables) {
            output += `TABLE: ${table}\n`;
            try {
                const [cols] = await connection.query(`DESCRIBE ${table}`);
                cols.forEach(c => {
                    output += `  - ${c.Field} (${c.Type})${c.Key === 'PRI' ? ' [PK]' : ''}${c.Extra ? ' [' + c.Extra + ']' : ''}\n`;
                });
            } catch (err) {
                output += `  ERROR: ${err.message}\n`;
            }
            output += '\n';
        }
        
        fs.writeFileSync('phase11_schema.txt', output);
        console.log('Schema research results written to phase11_schema.txt');
        await connection.end();
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

main();
