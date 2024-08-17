import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// import CustomParagraph from './nodes/CustomParagraph';
// import CustomDialogue from './nodes/CustomDialogue';
import ActionBlock from './nodes/ActionBlock';
import CharacterName from './nodes/CharacterName';
import Dialogue from './nodes/Dialogue';
import SceneHeading from './nodes/SceneHeading';

import Toolbar from './Toolbar';
import './styles/ScriptEditor.css';

export default function ScriptEditor() {
    const [blockType, setBlockType] = useState('actionBlock');

    const editor = useEditor({
        extensions: [
            StarterKit,
            ActionBlock,
            CharacterName,
            Dialogue,
            SceneHeading,
        ],
        content: '<actionBlock>Start typing your script...</actionBlock>',
    });

    const contentRef = useRef(null);
    const [pages, setPages] = useState([{}]);

    useEffect(() => {
        if (editor && contentRef.current) {
            const handleSplit = () => {
                const contentElement = contentRef.current;
                const contentHeight = contentElement.scrollHeight;

                const maxPageHeight = 29.7 * 37.8;
                const pageCount = Math.ceil(contentHeight / maxPageHeight);

                setPages(Array(pageCount).fill({}));
            };

            editor.on('update', handleSplit);
            window.addEventListener('resize', handleSplit);

            return () => {
                window.removeEventListener('resize', handleSplit);
                editor.off('update', handleSplit);
            };
        }
    }, [editor]);

    useEffect(() => {
        if (editor) {
            const insertBlock = () => {
                switch (blockType) {
                    case 'actionBlock':
                        editor.chain().focus().setNode('actionBlock').run();
                        break;
                    case 'characterName':
                        editor.chain().focus().setNode('characterName').run();
                        break;
                    case 'dialogue':
                        editor.chain().focus().setNode('dialogue').run();
                        break;
                    case 'sceneHeading':
                        editor.chain().focus().setNode('sceneHeading').run();
                        break;
                    default:
                        editor.chain().focus().setNode('actionBlock').run();
                        break;
                }
            };

            editor.view.dom.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    insertBlock();
                }
            });

            return () => {
                editor.view.dom.removeEventListener('keydown', insertBlock);
            };
        }
    }, [editor, blockType]);

    useEffect(() => {
        if (editor) {
            const handleSelectionUpdate = () => {
                const { $from } = editor.state.selection;
                const blockType = $from.node().type.name;
                setBlockType(blockType);
            };

            editor.on('selectionUpdate', handleSelectionUpdate);

            return () => {
                editor.off('selectionUpdate', handleSelectionUpdate);
            };
        }
    }, [editor]);


    return (
        <div>
            <Toolbar editor={editor} setBlockType={setBlockType} />
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
