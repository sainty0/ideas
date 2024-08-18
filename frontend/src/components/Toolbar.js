import React, { useState } from 'react';

function Toolbar({ toggleBlockType, currentBlockType, toggleBold, toggleItalic, toggleBulletList, toggleOrderedList }) {
  const [selectedBlockType, setSelectedBlockType] = useState(currentBlockType);

  const handleBlockTypeChange = (event) => {
    const newBlockType = event.target.value;
    setSelectedBlockType(newBlockType);
    toggleBlockType(newBlockType);
  };

  return (
    <div className="toolbar">
      {/* Dropdown for block types */}
      <select value={selectedBlockType} onChange={handleBlockTypeChange}>
        <option value="sceneHeading">Scene Heading</option>
        <option value="actionBlock">Action Block</option>
        <option value="dialogue">Dialogue</option>
      </select>
      <button onClick={toggleBold}>Bold</button>
      <button onClick={toggleItalic}>Italic</button>
      <button onClick={toggleBulletList}>Bullet List</button>
      <button onClick={toggleOrderedList}>Ordered List</button>
    </div>
  );
}


export default Toolbar;

