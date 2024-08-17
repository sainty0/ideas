import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './ScriptEditor.css';

export default function ScriptEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start typing your script...</p>',
  });

  const [pages, setPages] = useState([{}]);
  const contentRef = useRef(null);

  useEffect(() => {
    if (editor && contentRef.current) {
      const handleSplit = () => {
        const contentElement = contentRef.current;
        const contentHeight = contentElement.scrollHeight; // The actual height of the content

        const maxPageHeight = 29.7 * 37.8;
        const pageCount = Math.ceil(contentHeight / maxPageHeight);
        setPages(Array(pageCount).fill({}));
      };

      // Listen for updates to the editor and window resize events
      editor.on('update', handleSplit);
      window.addEventListener('resize', handleSplit);

      // Cleanup event listeners
      return () => {
        window.removeEventListener('resize', handleSplit);
        editor.off('update', handleSplit);
      };
    }
  }, [editor]);

  return (
    <div>
      {pages.map((_, index) => (
        <div className="page" key={index}>
          <div className="editor-content" ref={contentRef}>
            <EditorContent editor={editor} />
          </div>
        </div>
      ))}
    </div>
  );
}

