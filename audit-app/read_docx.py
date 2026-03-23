import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def read_docx(path):
    try:
        with zipfile.ZipFile(path) as docx:
            tree = ET.XML(docx.read('word/document.xml'))
            # Find all text nodes using XPath-like syntax for ElementTree
            text = []
            for elem in tree.iter():
                if elem.tag.endswith('}t') and elem.text:
                    text.append(elem.text)
                elif elem.tag.endswith('}p'):
                    text.append('\n')
            
            # clean up newlines
            res = ''.join(text).split('\n')
            res = [r.strip() for r in res if r.strip()]
            return '\n'.join(res)
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

with open('forms_content.txt', 'w', encoding='utf-8') as f:
    for arg in sys.argv[1:]:
        f.write(f"--- START: {os.path.basename(arg)} ---\n")
        f.write(read_docx(arg) + "\n")
        f.write(f"--- END: {os.path.basename(arg)} ---\n\n")
