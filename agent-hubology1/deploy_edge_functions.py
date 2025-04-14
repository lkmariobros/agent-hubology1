import os
import json
import requests
from pathlib import Path

# Supabase project details
SUPABASE_PROJECT_ID = 'twttyqbqhlgyzntcblbz'
SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHR5cWJxaGxneXpudGNibGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzY1NzkwNCwiZXhwIjoyMDQ5MjMzOTA0fQ.WWjfijPdb7B2nXQvIUhvMLabZMRfHFn1PZ2R2F07JNk'

# Path to edge functions
FUNCTIONS_DIR = Path(__file__).parent / 'supabase' / 'functions'

# Function to read a file
def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

# Function to deploy an edge function
def deploy_function(name, code, verify_jwt=True):
    url = f'https://api.supabase.com/v1/projects/{SUPABASE_PROJECT_ID}/functions'
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {SUPABASE_API_KEY}'
    }
    
    data = {
        'name': name,
        'slug': name.lower().replace('_', '-'),
        'verify_jwt': verify_jwt,
        'body': code
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code >= 200 and response.status_code < 300:
        print(f'Successfully deployed function: {name}')
        return response.json()
    else:
        print(f'Failed to deploy function {name}: {response.status_code} {response.text}')
        return None

# Main function to deploy all edge functions
def deploy_all_functions():
    # Get all directories in the functions directory (each directory is a function)
    function_dirs = [d for d in os.listdir(FUNCTIONS_DIR) if os.path.isdir(os.path.join(FUNCTIONS_DIR, d)) and not d.startswith('_')]
    
    print(f'Found {len(function_dirs)} functions to deploy')
    
    # Deploy each function
    for function_dir in function_dirs:
        function_path = os.path.join(FUNCTIONS_DIR, function_dir, 'index.ts')
        
        if os.path.exists(function_path):
            code = read_file(function_path)
            print(f'Deploying function: {function_dir}')
            
            try:
                result = deploy_function(function_dir, code)
                if result:
                    print(f'Successfully deployed function: {function_dir}')
            except Exception as e:
                print(f'Error deploying function {function_dir}: {e}')
        else:
            print(f'Function {function_dir} does not have an index.ts file')
    
    print('All functions deployed successfully!')

# Run the deployment
if __name__ == '__main__':
    deploy_all_functions()
