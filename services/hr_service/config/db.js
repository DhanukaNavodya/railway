import mysql from 'mysql2';
import dotenv from 'dotenv';

// Suppress dotenv logging completely
process.env.DOTENV_CONFIG_DEBUG = 'false';
dotenv.config({ debug: false, override: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection with retry
const testConnection = async (retries = 10, delay = 10000) => {
  console.log(`🔧 Database Configuration:`);
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting database connection (${i + 1}/${retries})...`);
      const connection = await pool.promise();
      await connection.query('SELECT 1');
      console.log('✅ Database connected successfully!');
      console.log(`📊 Database: ${process.env.DB_NAME}`);
      console.log(`🌐 Host: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
      return;
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`);
      console.error('Error:', error.message);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ All database connection attempts failed');
        console.error('Please check your database configuration');
        console.error('Make sure MySQL container is running and healthy');
        process.exit(1);
      }
    }
  }
};

// Test connection on startup
testConnection();

export default pool.promise();