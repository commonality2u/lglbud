import os

def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def extract_frontend_files():
    # List of files to extract
    frontend_files = [
        'next-env.d.ts',
        'tsconfig.json',
        'next.config.mjs',
        'postcss.config.mjs',
        '.eslintrc.json',
        'Dockerfile',
        'package.json',
        'tailwind.config.ts',
        'vitest.config.ts'
    ]
    
    # Create output directory if it doesn't exist
    output_dir = 'analysis_output'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Path to frontend directory
    frontend_dir = 'frontend'
    
    # Output file path
    output_file = os.path.join(output_dir, 'frontend_files_list.txt')
    
    with open(output_file, 'w', encoding='utf-8') as out_file:
        out_file.write("Frontend Files Contents:\n")
        out_file.write("Root Directory: /frontend\n\n")
        
        for index, filename in enumerate(frontend_files, 1):
            file_path = os.path.join(frontend_dir, filename)
            abs_path = os.path.abspath(file_path)
            
            out_file.write(f"{index}. File: {filename}\n")
            out_file.write(f"Directory Path: {abs_path}\n")
            out_file.write("=" * 80 + "\n\n")
            
            content = read_file_content(file_path)
            out_file.write(content)
            out_file.write("\n\n" + "=" * 80 + "\n\n")

if __name__ == "__main__":
    extract_frontend_files()
    print("Files have been extracted to analysis_output/frontend_files_list.txt") 