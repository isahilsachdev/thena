// src/db/runMigrations.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ufkghuwkefddufgiiaxu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin privileges

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Supabase URL or service key is missing in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    if (file.endsWith('.sql')) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      logger.info(`Running migration: ${file}`);
      
      try {
        // Execute the SQL directly using the Supabase REST API
        const { error } = await supabase.rpc('pgmigrate', { query: sql });
        
        if (error) {
          logger.error(`Error running migration ${file}: ${error.message}`);
          process.exit(1);
        }
        
        logger.info(`Migration ${file} completed successfully`);
      } catch (error) {
        logger.error(`Error running migration ${file}: ${error.message}`);
        process.exit(1);
      }
    }
  }
  
  logger.info('All migrations completed successfully');
}

runMigrations().catch(err => {
  logger.error('Migration failed:', err);
  process.exit(1);
});