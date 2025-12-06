const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,                    
  user: 'mariaburtseva',         
  database: 'cookies_shop',      
  password: '',                  
});

module.exports = pool;

