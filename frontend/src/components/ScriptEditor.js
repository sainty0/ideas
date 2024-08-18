
import React, { useEffect, useRef, useState } from 'react';
import { EditorState, Plugin } from 'prosemirror-state';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Toolbar from './Toolbar';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { dropCursor } from 'prosemirror-dropcursor';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { baseKeymap, splitBlock } from 'prosemirror-commands';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list'; // For lists
import { bulletList, orderedList, listItem } from 'prosemirror-schema-list';

import './styles/ScriptEditor.css';
const mySchema = new Schema({
    nodes: basicSchema.spec.nodes.append({
        sceneHeading: {
            content: "text*",
            group: "block",
            toDOM() { return ["h1", { class: "scene-heading" }, 0]; },
            parseDOM: [{ tag: "h1.scene-heading" }]
        },
        actionBlock: {
            content: "text*",
            group: "block",
            toDOM() { return ["p", { class: "action-block" }, 0]; },
            parseDOM: [{ tag: "p.action-block" }]
        },
        dialogue: {
            content: "text*",
            group: "block",
            toDOM() { return ["p", { class: "dialogue" }, 0]; },
            parseDOM: [{ tag: "p.dialogue" }]
        },
        character: {
            content: "text*",
            group: "block",
            toDOM() { return ["p", { class: "character-name" }, 0]; },
            parseDOM: [{ tag: "p.character-name" }]
        },
        bullet_list: {
            group: "block",
            content: "list_item+",
            toDOM() { return ["ul", 0]; },
            parseDOM: [{ tag: "ul" }]
        },
        ordered_list: {
            group: "block",
            content: "list_item+",
            attrs: { order: { default: 1 } },
            toDOM(node) { return ["ol", { start: node.attrs.order }, 0]; },
            parseDOM: [{
                tag: "ol",
                getAttrs(dom) { return { order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 }; }
            }]
        },
        list_item: {
            content: "paragraph block*",
            toDOM() { return ["li", 0]; },
            parseDOM: [{ tag: "li" }]
        }
    }),
    marks: basicSchema.spec.marks.append({
        bold: {
            toDOM: () => ["strong", 0],
            parseDOM: [{ tag: "strong" }]
        },
        italic: {
            toDOM: () => ["em", 0],
            parseDOM: [{ tag: "em" }]
        }
    })
});



export default function ScriptEditor({ toggleBlockType }) {
    const editorRef = useRef(null);
    const viewRef = useRef(null);
    const [scenes, setScenes] = useState([]);
    const [blockType, setBlockType] = useState('actionBlock');
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
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
          console.log(data.image_url);

          if (response.ok) {
              setImageUrl(data.image_url);
              imageUrls.push(data.image_url);
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

    const toggleBold = () => {
        const { state, dispatch } = viewRef.current;
        const { schema } = state;
        toggleMark(schema.marks.bold)(state, dispatch);
    };

    const toggleItalic = () => {
        const { state, dispatch } = viewRef.current;
        const { schema } = state;
        toggleMark(schema.marks.italic)(state, dispatch);
    };

    const toggleBulletList = () => {
        const { state, dispatch } = viewRef.current;
        const { schema } = state;
        wrapInList(schema.nodes.bullet_list)(state, dispatch);
    };

    const toggleOrderedList = () => {
        const { state, dispatch } = viewRef.current;
        const { schema } = state;
        wrapInList(schema.nodes.ordered_list)(state, dispatch);
    };

    useEffect(() => {
        if (editorRef.current) {
            const state = EditorState.create({
                schema: mySchema,
                plugins: [
                    dropCursor(),
                    history(),
                    keymap({
                        'Mod-z': undo,
                        'Mod-y': redo,
                        'Enter': splitBlock,
                        ...baseKeymap
                    }),
                    new Plugin({
                        props: {
                            handleDOMEvents: {
                                selectionchange: (_, view) => {
                                    const { $from } = view.state.selection;
                                    setBlockType($from.parent.type.name);
                                }
                            }
                        }
                    })
                ]
            });

            const view = new EditorView(editorRef.current, {
                state,
                dispatchTransaction(transaction) {
                    const newState = view.state.apply(transaction);
                    view.updateState(newState);

                    // Update scenes when the document changes
                    updateScenes(newState);
                }
            });

            viewRef.current = view;

            // Initialize scenes from the initial state
            updateScenes(state);

            return () => {
                view.destroy();
            };
        }
    }, []);

    const updateScenes = (state) => {
        const scenesList = [];
        let sceneStart = null;

        state.doc.forEach((node, offset) => {
            if (node.type.name === 'sceneHeading') {
                if (sceneStart !== null) {
                    scenesList.push({ content: state.doc.slice(sceneStart, offset).content, start: sceneStart });
                }
                sceneStart = offset;
            }
        });

        if (sceneStart !== null) {
            scenesList.push({ content: state.doc.slice(sceneStart).content, start: sceneStart });
        }

        setScenes(scenesList.map((scene, index) => ({ id: `scene-${index}`, ...scene })));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedScenes = Array.from(scenes);
        const reorderedImages = Array.from(imageUrls);
        if (result.destination) {
          setPrompt(scenes[result.destination.index]);
          handleSubmit();
        };
        

        const [removed] = reorderedScenes.splice(result.source.index, 1);
        reorderedScenes.splice(result.destination.index, 0, removed);

        setScenes(reorderedScenes);
        reorderedImages.splice(result.destination.index, 0, removed);
        setImageUrls(reorderedImages);
        

        // Update the editor with the new scene order
        const tr = viewRef.current.state.tr;
        tr.delete(0, viewRef.current.state.doc.content.size); // Clear current document
        reorderedScenes.forEach(scene => {
            tr.insert(tr.doc.content.size, scene.content); // Insert scenes in new order
        });
        viewRef.current.dispatch(tr);
    };

    // Function to toggle block types for formatting
    const handleToggleBlockType = (type) => {
        const { state, dispatch } = viewRef.current;
        const { selection, schema } = state;
        const blockType = schema.nodes[type];
        if (blockType) {
            const tr = state.tr.setBlockType(selection.from, selection.to, blockType);
            dispatch(tr);
        }
    };

    return (
        <div className="script-editor">
            <Toolbar
                toggleBlockType={handleToggleBlockType}
                currentBlockType={blockType}
                toggleBold={toggleBold}
                toggleItalic={toggleItalic}
                toggleBulletList={toggleBulletList}
                toggleOrderedList={toggleOrderedList}
            />
            <div className="editor-container" ref={editorRef}></div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {imageUrl && <img src={imageUrl} alt="Generated" />}
            <SceneList scenes={scenes} onDragEnd={handleDragEnd} imageUrls={imageUrls} />
        </div>
    );
}

function SceneList({ scenes, onDragEnd, imageUrls }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="scenes">
                {(provided) => (
                    <div className="scene-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {scenes.map((scene, index) => (
                            <Draggable key={scene.id} draggableId={scene.id} index={index}>
                                {(provided) => (
                                    <div
                                        className="scene-item"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        Scene {index + 1}
                                        
                                        {/* {imageUrls[index] && <img src={imageUrls[index]} alt="Generated" />} */}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}