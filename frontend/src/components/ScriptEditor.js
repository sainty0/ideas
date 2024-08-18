import React, { useEffect, useRef, useState } from 'react';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { dropCursor } from 'prosemirror-dropcursor';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import GenerateImage from './nodes/GenerateImage';

import { baseKeymap, splitBlock } from 'prosemirror-commands';
import './styles/ScriptEditor.css';
import Toolbar from './Toolbar';

const mySchema = new Schema({
  nodes: basicSchema.spec.nodes.append({
    sceneHeading: {
      content: "text*",
      group: "block",
      toDOM() { return ["h1", { class: "scene-heading", draggable: "true" }, 0]; },
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
    }
  }),
  marks: basicSchema.spec.marks
});

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
  const editorRef = useRef(null);
  const [blockType, setBlockType] = useState('actionBlock');
  const viewRef = useRef(null);

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
                },
                dragstart: (view, event) => {
                  handleDragStart(view, event);
                },
                drop: (view, event) => {
                  handleDrop(view, event);
                },
                mousedown: (view, event) => {
                  const isDraggable = event.target.closest('.scene-heading');
                  if (isDraggable) {
                    // Prevent ProseMirror from handling the event (i.e., placing the cursor in text)
                    event.preventDefault();
                  }
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
        }
      });

      viewRef.current = view;

      return () => {
        view.destroy();
      };
    }
  }, []);

  const toggleBlockType = (type) => {
    const { state, dispatch } = viewRef.current;
    const { $from, $to } = state.selection;

    const applicableNode = state.schema.nodes[type];
    if (!applicableNode) return;

    // Check if the selection is a block and toggle the node type
    dispatch(
      state.tr.setBlockType($from.pos, $to.pos, applicableNode)
    );
  };

  const handleDragStart = (view, event) => {
    const { state } = view;
    const { selection } = state;

    const sceneStart = findSceneStart(state, selection.from);
    const sceneEnd = findSceneEnd(state, sceneStart);

    const sceneContent = state.doc.slice(sceneStart, sceneEnd).content;
    event.dataTransfer.setData("text/plain", JSON.stringify(sceneContent.toJSON()));
    event.dataTransfer.effectAllowed = "move";

    view.dragging = { start: sceneStart, end: sceneEnd };
  };

  const handleDrop = (view, event) => {
    event.preventDefault();
    const { state, dragging } = view;
    if (!dragging) return;

    const dropPos = view.posAtCoords({ left: event.clientX, top: event.clientY }).pos;

    const sceneContent = JSON.parse(event.dataTransfer.getData("text/plain"));
    const sceneSlice = state.schema.nodeFromJSON(sceneContent);

    const tr = state.tr.delete(dragging.start, dragging.end).insert(dropPos, sceneSlice);
    view.dispatch(tr);

    view.dragging = null;
  };

  const findSceneStart = (state, pos) => {
    let $pos = state.doc.resolve(pos);
    while ($pos.nodeBefore && $pos.nodeBefore.type.name !== 'sceneHeading') {
      $pos = state.doc.resolve($pos.before());
    }
    return $pos.before();
  };

  const findSceneEnd = (state, pos) => {
    let $pos = state.doc.resolve(pos);
    while ($pos.nodeAfter && $pos.nodeAfter.type.name !== 'sceneHeading') {
      $pos = state.doc.resolve($pos.after());
    }
    return $pos.after();
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
  return (
    <div>
      <Toolbar toggleBlockType={toggleBlockType} currentBlockType={blockType} />
      <div className="editor-container" ref={editorRef}></div>
    </div>
  );
}

