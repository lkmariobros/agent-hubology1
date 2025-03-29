
#!/usr/bin/env node

/**
 * Script to generate Supabase TypeScript types from the database schema
 * Run with: node generate-types.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'synabhmsxsvsxkyzhfss';
const OUTPUT_PATH = path.join(__dirname, '..', 'types', 'supabase.d.ts');

console.log('Generating Supabase types...');

try {
  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate types using Supabase CLI
  const command = `npx supabase gen types typescript --project-id ${PROJECT_ID} --schema public > ${OUTPUT_PATH}`;
  execSync(command, { stdio: 'inherit' });
  
  console.log(`Types generated successfully at: ${OUTPUT_PATH}`);
} catch (error) {
  console.error('Error generating types:', error);
  process.exit(1);
}
