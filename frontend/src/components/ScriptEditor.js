import React, { useEffect, useRef, useState } from 'react';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { dropCursor } from 'prosemirror-dropcursor';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { baseKeymap, splitBlock, splitBlockAs, setBlockType } from 'prosemirror-commands';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list'; // For lists
import { bulletList, orderedList, listItem } from 'prosemirror-schema-list';

import mySchema from './Schema';
import Toolbar from './Toolbar';
import SceneList from './SceneList';
import './styles/ScriptEditor.css';

export default function ScriptEditor({ toggleBlockType }) {
    const editorRef = useRef(null);
    const viewRef = useRef(null);
    const [scenes, setScenes] = useState([]);
    const [currentBlockType, setCurrentBlockType] = useState('sceneHeading');
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
              setImageUrls([...imageUrls, data.image_url]);
              
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
                doc: mySchema.node('doc', null, [
                    mySchema.node('sceneHeading')
                ]),
                plugins: [
                    dropCursor(),
                    history(),
                    keymap({
                        'Mod-z': undo,
                        'Mod-y': redo,
                        'Enter': customSplitBlock,
                        // ...baseKeymap
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

    const customSplitBlock = (state, dispatch) => {
        console.log("here");
  const { $from, $to } = state.selection;
  const { schema } = state;
    if (dispatch) {
      let tr = state.tr.split($from.pos);

      // Ensure the new block is of type actionBlock
      const newPos = tr.mapping.map($from.pos + 1);
      tr = tr.setBlockType(newPos, newPos, schema.nodes.actionBlock);

      dispatch(tr);
    }
    return true;

  return false;
};

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
        imageUrls.splice(result.destination.index);
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
        tr.delete(0, viewRef.current.state.doc.content.size);
        reorderedScenes.forEach(scene => {
            tr.insert(tr.doc.content.size, scene.content);
        });
        viewRef.current.dispatch(tr);
    };

    // Function to toggle block types for formatting
    const handleToggleBlockType = (type) => {
        const { state, dispatch } = viewRef.current;
        const { selection, schema } = state;
        const blockType = schema.nodes[type];
        if (currentBlockType) {
            const tr = state.tr.setBlockType(selection.from, selection.to, blockType);
            dispatch(tr);
        }
    };
    console.log(imageUrls)

    return (
        <div className="script-editor">
            <div className="editor-wrapper">
                <Toolbar
                    toggleBlockType={handleToggleBlockType}
                    currentBlockType={currentBlockType}
                    toggleBold={toggleBold}
                    toggleItalic={toggleItalic}
                    toggleBulletList={toggleBulletList}
                    toggleOrderedList={toggleOrderedList}
                />
                <div className="editor-container" ref={editorRef}></div>
            </div>
            <SceneList scenes={scenes} onDragEnd={handleDragEnd} imageUrls={imageUrls} />
        </div>
    );    
}

