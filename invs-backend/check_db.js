const mysql = require('mysql2/promise');

async function check() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3308,
      user: 'root',
      password: '',
      database: 'invs'
    });
    console.log('--- TABLES ---');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(JSON.stringify(tables, null, 2));

    const coreTables = ['drug_vn', 'ms_po', 'ms_po_c', 'dispensed', 'req_con', 'company'];
    for (const table of coreTables) {
         console.log(`--- SCHEMA: ${table} ---`);
         try {
             const [schema] = await connection.query(`DESCRIBE ${table}`);
             console.log(JSON.stringify(schema, null, 2));
         } catch(e) {
             console.log(`Error describing ${table}: ${e.message}`);
         }
    }
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

check();
