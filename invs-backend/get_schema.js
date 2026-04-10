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
        const tables = ['drug_vn', 'ms_po', 'ms_po_c', 'dispensed', 'req_con', 'company'];
        let output = '';
        
        for (const table of tables) {
            output += `--- ${table} ---\n`;
            try {
                const [rows] = await connection.query(`DESCRIBE ${table}`);
                output += JSON.stringify(rows, null, 2) + '\n\n';
            } catch (e) {
                output += `Error: ${e.message}\n\n`;
            }
        }
        
        fs.writeFileSync('schema_info.txt', output);
        console.log('Schema info written to schema_info.txt');
        await connection.end();
    } catch (e) {
        console.error('Connection Error:', e.message);
    }
}

main();
