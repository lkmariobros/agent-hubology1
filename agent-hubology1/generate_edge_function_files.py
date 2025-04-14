import os
import shutil
from pathlib import Path

# Path to edge functions
FUNCTIONS_DIR = Path(__file__).parent / 'supabase' / 'functions'
OUTPUT_DIR = Path(__file__).parent / 'edge_functions_to_deploy'

# Create output directory if it doesn't exist
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Function to read a file
def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

# Function to write a file
def write_file(file_path, content):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Main function to generate individual files for each edge function
def generate_edge_function_files():
    # Get all directories in the functions directory (each directory is a function)
    function_dirs = [d for d in os.listdir(FUNCTIONS_DIR) if os.path.isdir(os.path.join(FUNCTIONS_DIR, d)) and not d.startswith('_')]
    
    print(f'Found {len(function_dirs)} functions to process')
    
    # Process each function
    for function_dir in function_dirs:
        function_path = os.path.join(FUNCTIONS_DIR, function_dir, 'index.ts')
        
        if os.path.exists(function_path):
            code = read_file(function_path)
            output_path = os.path.join(OUTPUT_DIR, f'{function_dir}.ts')
            
            print(f'Generating file for function: {function_dir}')
            write_file(output_path, code)
        else:
            print(f'Function {function_dir} does not have an index.ts file')
    
    print('All function files generated successfully!')

# Run the script
if __name__ == '__main__':
    generate_edge_function_files()
