import json
import os

def generate_todo_summary():
    """Generates a prioritized todo list from existing analysis results."""
    # Get current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define paths explicitly
    analysis_dir = os.path.join(current_dir, "analysis_output")
    analysis_file = os.path.join(analysis_dir, "codebase_analysis.json")
    todo_file = os.path.join(analysis_dir, "todo.md")
    
    # Check if analysis directory exists
    if not os.path.exists(analysis_dir):
        print(f"Analysis directory not found at: {analysis_dir}")
        return
        
    # Check if analysis file exists
    if not os.path.exists(analysis_file):
        print(f"Analysis file not found at: {analysis_file}")
        return
        
    print(f"Reading analysis from: {analysis_file}")
    
    try:
        with open(analysis_file, 'r', encoding='utf-8') as f:
            analyses = json.load(f)
        
        todo_content = "# Development Todo List\n\n"
        
        # Track items by priority
        high_priority = []
        medium_priority = []
        low_priority = []
        
        for file_analysis in analyses:
            filepath = os.path.basename(file_analysis['filepath'])
            
            # Get missing requirements
            for item in file_analysis['analysis'].get('missing', []):
                todo_item = f"- [{filepath}] {item['requirement']}: {item['details']}"
                if item['priority'] == 'High':
                    high_priority.append(todo_item)
                elif item['priority'] == 'Medium':
                    medium_priority.append(todo_item)
                else:
                    low_priority.append(todo_item)
            
            # Get validation issues
            for issue in file_analysis['validation'].get('issues', []):
                todo_item = f"- [{filepath}] Fix: {issue}"
                medium_priority.append(todo_item)
        
        # Write prioritized lists
        todo_content += "## High Priority\n"
        todo_content += "\n".join(high_priority) + "\n\n"
        
        todo_content += "## Medium Priority\n"
        todo_content += "\n".join(medium_priority) + "\n\n"
        
        todo_content += "## Low Priority\n"
        todo_content += "\n".join(low_priority)
        
        # Save to file
        print(f"Writing todo list to: {todo_file}")
        with open(todo_file, 'w', encoding='utf-8') as f:
            f.write(todo_content)
        
        print(f"\nTodo list successfully generated at: {todo_file}")
        
    except Exception as e:
        print(f"Error generating todo list: {str(e)}")

if __name__ == "__main__":
    generate_todo_summary() 