// This script deploys all edge functions to Supabase
// Run with: node deploy_edge_functions.js

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase project details
const SUPABASE_PROJECT_ID = 'twttyqbqhlgyzntcblbz';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHR5cWJxaGxneXpudGNibGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzY1NzkwNCwiZXhwIjoyMDQ5MjMzOTA0fQ.WWjfijPdb7B2nXQvIUhvMLabZMRfHFn1PZ2R2F07JNk'; // Supabase service role key

// Path to edge functions
const FUNCTIONS_DIR = path.join(__dirname, 'supabase', 'functions');

// Function to read a file
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to deploy an edge function
function deployFunction(name, code, verifyJwt = true) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name,
      verify_jwt: verifyJwt,
      body: code
    });

    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${SUPABASE_PROJECT_ID}/functions?slug=${encodeURIComponent(name)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`Successfully deployed function: ${name}`);
          resolve(responseData);
        } else {
          console.error(`Failed to deploy function ${name}: ${res.statusCode} ${responseData}`);
          reject(new Error(`Failed to deploy function ${name}: ${res.statusCode} ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error deploying function ${name}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Main function to deploy all edge functions
async function deployAllFunctions() {
  try {
    // Get all directories in the functions directory (each directory is a function)
    const functionDirs = fs.readdirSync(FUNCTIONS_DIR)
      .filter(dir => fs.statSync(path.join(FUNCTIONS_DIR, dir)).isDirectory() && !dir.startsWith('_'));

    console.log(`Found ${functionDirs.length} functions to deploy`);

    // Deploy each function
    for (const functionDir of functionDirs) {
      const functionPath = path.join(FUNCTIONS_DIR, functionDir, 'index.ts');

      if (fs.existsSync(functionPath)) {
        const code = readFile(functionPath);
        console.log(`Deploying function: ${functionDir}`);

        try {
          await deployFunction(functionDir, code);
          console.log(`Successfully deployed function: ${functionDir}`);
        } catch (error) {
          console.error(`Error deploying function ${functionDir}:`, error);
        }
      } else {
        console.warn(`Function ${functionDir} does not have an index.ts file`);
      }
    }

    console.log('All functions deployed successfully!');
  } catch (error) {
    console.error('Error deploying functions:', error);
  }
}

// Run the deployment
deployAllFunctions();
