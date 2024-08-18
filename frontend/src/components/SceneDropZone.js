import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

export default function SceneDropZone({ onDrop }) {
  return (
    <Droppable droppableId="scene-drop-zone">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
            padding: 8,
            width: 250,
            minHeight: 500,
          }}
        >
          <h3>Drop Scenes Here</h3>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
