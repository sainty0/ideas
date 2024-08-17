import React from 'react';

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar">
      <button
        onClick={() => editor.chain().focus().setNode('sceneHeading').run()}
      >
        Scene Heading
      </button>
      <button
        onClick={() => editor.chain().focus().setNode('actionBlock').run()}
      >
        Action Block
      </button>
      <button
        onClick={() => editor.chain().focus().setNode('characterName').run()}
      >
        Character Name
      </button>
      <button
        onClick={() => editor.chain().focus().setNode('dialogue').run()}
      >
        Dialogue
      </button>
    </div>
  );
};

export default Toolbar;

