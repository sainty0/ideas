
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
                                                    style={{ ...provided.draggableProps.style,
                                                        left: "auto !important",
                                                        top: "auto !important",
                                                }}
                                    >
                                        Scene {index + 1}
                                        {imageUrls[index] && <img src={imageUrls[index]} alt="Generated" />}
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

export default SceneList;
