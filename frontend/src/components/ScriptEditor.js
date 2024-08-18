// import React, { useEffect, useRef, useState } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Bold from '@tiptap/extension-bold';
// import Italic from '@tiptap/extension-italic';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//
// import ActionBlock from './nodes/ActionBlock';
// import CharacterName from './nodes/CharacterName';
// import Dialogue from './nodes/Dialogue';
// import SceneHeading from './nodes/SceneHeading';
// import Scenes from './nodes/Scenes';
// import Toolbar from './Toolbar';
// import './styles/ScriptEditor.css';
//
// export default function ScriptEditor() {
//     const [blockType, setBlockType] = useState('actionBlock');
//
//     const editor = useEditor({
//         extensions: [
//             StarterKit,
//             Bold,
//             Italic,
//             ActionBlock,
//             CharacterName,
//             Dialogue,
//             SceneHeading,
//         ],
//         content: '<actionBlock>Start typing your script...</actionBlock>',
//     });
//
//     const contentRef = useRef(null);
//     const [pages, setPages] = useState([{}]);
//     const [scenes, setScenes] = useState([]);
//
//     useEffect(() => {
//         if (editor && contentRef.current) {
//             const handleSplit = () => {
//                 const contentElement = contentRef.current;
//                 const contentHeight = contentElement.scrollHeight;
//
//                 const maxPageHeight = 29.7 * 37.8;
//                 const pageCount = Math.ceil(contentHeight / maxPageHeight);
//
//                 setPages(Array(pageCount).fill({}));
//             };
//
//             editor.on('update', handleSplit);
//             window.addEventListener('resize', handleSplit);
//
//             return () => {
//                 window.removeEventListener('resize', handleSplit);
//                 editor.off('update', handleSplit);
//             };
//         }
//     }, [editor]);
//
//     useEffect(() => {
//         if (editor) {
//             const insertBlock = () => {
//                 switch (blockType) {
//                     case 'actionBlock':
//                         editor.chain().focus().setNode('actionBlock').run();
//                         break;
//                     case 'characterName':
//                         editor.chain().focus().setNode('characterName').run();
//                         break;
//                     case 'dialogue':
//                         editor.chain().focus().setNode('dialogue').run();
//                         break;
//                     case 'sceneHeading':
//                         editor.chain().focus().setNode('sceneHeading').run();
//                         break;
//                     default:
//                         editor.chain().focus().setNode('actionBlock').run();
//                         break;
//                 }
//             };
//
//             editor.view.dom.addEventListener('keydown', (event) => {
//                 if (event.key === 'Enter') {
//                     event.preventDefault();
//                     insertBlock();
//                 }
//             });
//
//             return () => {
//                 editor.view.dom.removeEventListener('keydown', insertBlock);
//             };
//         }
//     }, [editor, blockType]);
//
//     useEffect(() => {
//         if (editor) {
//             const handleSelectionUpdate = () => {
//                 const { $from } = editor.state.selection;
//                 const blockType = $from.node().type.name;
//                 setBlockType(blockType);
//             };
//
//             editor.on('selectionUpdate', handleSelectionUpdate);
//
//             return () => {
//                 editor.off('selectionUpdate', handleSelectionUpdate);
//             };
//         }
//     }, [editor]);
//
//
//     useEffect(() => {
//         if (editor) {
//             const updateScenes = () => {
//                 const newScenes = editor.state.doc.content.content
//                 .filter(node => node.type.name === 'scene')
//                 .map((node, index) => ({
//                     id: `scene-${index}`,
//                     content: node.textContent,
//                 }));
//                 setScenes(newScenes);
//             };
//
//             editor.on('update', updateScenes);
//             return () => editor.off('update', updateScenes);
//         }
//     }, [editor]);
//
//     const onDragEnd = (result) => {
//         // Handle drag end
//         console.log(result);
//     };
//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <div>
//                 <Toolbar editor={editor} setBlockType={setBlockType} blockType={blockType} />
//                 <Droppable droppableId="script">
//                     {(provided) => (
//                         <div {...provided.droppableProps} ref={provided.innerRef}>
//                             {scenes.map((scene, index) => (
//                                 <Draggable key={scene.id} draggableId={scene.id} index={index}>
//                                     {(provided) => (
//                                         <div
//                                             ref={provided.innerRef}
//                                             {...provided.draggableProps}
//                                             {...provided.dragHandleProps}
//                                         >
//                                             <EditorContent editor={editor} />
//                                         </div>
//                                     )}
//                                 </Draggable>
//                             ))}
//                             {provided.placeholder}
//                         </div>
//                     )}
//                 </Droppable>
//             </div>
//         </DragDropContext>
//     );
// }
//
import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import ActionBlock from './nodes/ActionBlock';
import CharacterName from './nodes/CharacterName';
import Dialogue from './nodes/Dialogue';
import SceneHeading from './nodes/SceneHeading';
import GenerateImage from './nodes/GenerateImage';

import Toolbar from './Toolbar';
import './styles/ScriptEditor.css';

export default function ScriptEditor() {
    const [blockType, setBlockType] = useState('actionBlock');
    const [scenes, setScenes] = useState([]);
    const contentRef = useRef(null);
    const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

    const handleSubmit = async (e) => {

        try {
        const response = await fetch('http://localhost:5000/generate-image', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setImageUrl(data.image_url);
            setError('');
        } else {
            setError(data.error || 'Something went wrong');
            setImageUrl('');
        }
        } catch (err) {
        setError('Network error: ' + err.message);
        setImageUrl('');
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            ActionBlock,
            CharacterName,
            Dialogue,
            SceneHeading
        ],
        content: '<actionBlock>Start typing your script...</actionBlock>',
        onUpdate: ({ editor }) => {
            updateScenes(editor);
        },
    });

    const updateScenes = (editor) => {
        if (!editor) return;

        const newScenes = [];
        let currentScene = { id: `scene-${Date.now()}`, content: '' };

        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'sceneHeading') {
                if (currentScene.content) {
                    newScenes.push(currentScene);
                }
                currentScene = { id: `scene-${Date.now()}-${pos}`, content: '' };
            }
            currentScene.content += node.textContent + '\n';
        });

        if (currentScene.content) {
            newScenes.push(currentScene);
        }

        setScenes(newScenes);
    };

    useEffect(() => {
        if (editor) {
            const handleSelectionUpdate = () => {
                const { $from } = editor.state.selection;
                const blockType = $from.parent.type.name;
                setBlockType(blockType);
            };

            editor.on('selectionUpdate', handleSelectionUpdate);
            return () => {
                editor.off('selectionUpdate', handleSelectionUpdate);
            };
        }
    }, [editor]);

        const onDragEnd = (result) => {
            if (result.destination) {
                setPrompt(scenes[result.destination.index]);
                handleSubmit();
            };
            
    };

        return (
        <div>
            <Toolbar editor={editor} setBlockType={setBlockType} blockType={blockType} />
            <div className="editor-container">
                <EditorContent editor={editor} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {imageUrl && <img src={imageUrl} alt="Generated" />}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="scenes">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="scenes-list">
                            {scenes.map((scene, index) => (
                                <Draggable key={scene.id} draggableId={scene.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="scene-item"
                                        >
                                            {scene.content.split('\n')[0]}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

