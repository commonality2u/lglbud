import json
from pathlib import Path
import pdfplumber
import re
from typing import List, Dict, Any, Tuple
import spacy
from spacy.tokens import Doc
import tkinter as tk
from tkinter import filedialog, ttk
import os

ENTITY_LABELS = [
    "COURT",
    "JUDGE",
    "CASE_NUMBER",
    "DATE",
    "DEADLINE",
    "PARTY",
    "ATTORNEY",
    "LAW_FIRM"
]

class AnnotationTool:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Legal Document Annotator")
        self.root.geometry("1200x800")
        
        self.current_file = None
        self.annotations = []
        self.current_text = ""
        
        self.setup_ui()
    
    def setup_ui(self):
        # Top frame for file operations
        top_frame = ttk.Frame(self.root)
        top_frame.pack(fill=tk.X, padx=5, pady=5)
        
        ttk.Button(top_frame, text="Load PDF", command=self.load_pdf).pack(side=tk.LEFT, padx=5)
        ttk.Button(top_frame, text="Save Annotations", command=self.save_annotations).pack(side=tk.LEFT, padx=5)
        
        # Main content frame
        content_frame = ttk.Frame(self.root)
        content_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Text area
        self.text_widget = tk.Text(content_frame, wrap=tk.WORD)
        self.text_widget.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Right panel for entity selection
        right_panel = ttk.Frame(content_frame)
        right_panel.pack(side=tk.RIGHT, fill=tk.Y, padx=5)
        
        ttk.Label(right_panel, text="Entity Type:").pack()
        self.entity_var = tk.StringVar(value=ENTITY_LABELS[0])
        entity_dropdown = ttk.Combobox(right_panel, textvariable=self.entity_var, values=ENTITY_LABELS)
        entity_dropdown.pack()
        
        ttk.Button(right_panel, text="Add Annotation", command=self.add_annotation).pack(pady=10)
        
        # Annotations list
        ttk.Label(right_panel, text="Current Annotations:").pack(pady=(20,5))
        self.annotations_listbox = tk.Listbox(right_panel, width=40, height=20)
        self.annotations_listbox.pack()
        
        ttk.Button(right_panel, text="Remove Selected", command=self.remove_annotation).pack(pady=5)
    
    def load_pdf(self):
        file_path = filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")])
        if file_path:
            self.current_file = file_path
            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() + "\n"
                
                self.current_text = text
                self.text_widget.delete(1.0, tk.END)
                self.text_widget.insert(1.0, text)
                
                # Clear existing annotations
                self.annotations = []
                self.annotations_listbox.delete(0, tk.END)
    
    def add_annotation(self):
        try:
            # Get selected text
            selected_text = self.text_widget.get(tk.SEL_FIRST, tk.SEL_LAST)
            start_idx = self.text_widget.index(tk.SEL_FIRST)
            end_idx = self.text_widget.index(tk.SEL_LAST)
            
            # Convert tkinter indices to character positions
            start_line, start_char = map(int, start_idx.split('.'))
            end_line, end_char = map(int, end_idx.split('.'))
            
            # Calculate absolute character positions
            start_pos = sum(len(self.text_widget.get(f"{i}.0", f"{i}.end")) + 1 
                          for i in range(1, start_line)) + start_char
            end_pos = sum(len(self.text_widget.get(f"{i}.0", f"{i}.end")) + 1 
                         for i in range(1, end_line)) + end_char
            
            # Add annotation
            entity_type = self.entity_var.get()
            annotation = (start_pos, end_pos, entity_type)
            self.annotations.append(annotation)
            
            # Update listbox
            self.annotations_listbox.insert(tk.END, 
                f"{entity_type}: {selected_text}")
            
            # Highlight text
            self.text_widget.tag_add("highlight", tk.SEL_FIRST, tk.SEL_LAST)
            self.text_widget.tag_config("highlight", background="yellow")
            
        except tk.TclError:
            # No text selected
            pass
    
    def remove_annotation(self):
        selection = self.annotations_listbox.curselection()
        if selection:
            index = selection[0]
            self.annotations.pop(index)
            self.annotations_listbox.delete(index)
    
    def save_annotations(self):
        if not self.current_file:
            return
        
        output_data = {
            "text": self.current_text,
            "entities": self.annotations,
            "file": os.path.basename(self.current_file)
        }
        
        save_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json")]
        )
        
        if save_path:
            with open(save_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2)
    
    def run(self):
        self.root.mainloop()

def main():
    tool = AnnotationTool()
    tool.run()

if __name__ == "__main__":
    main() 