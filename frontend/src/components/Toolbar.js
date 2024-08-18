function Toolbar({ toggleBlockType, currentBlockType }) {
  return (
    <div className="toolbar">
      <button
        className={currentBlockType === 'sceneHeading' ? 'active' : ''}
        onClick={() => toggleBlockType('sceneHeading')}
      >
        Scene Heading
      </button>
      <button
        className={currentBlockType === 'actionBlock' ? 'active' : ''}
        onClick={() => toggleBlockType('actionBlock')}
      >
        Action Block
      </button>
      <button
        className={currentBlockType === 'dialogue' ? 'active' : ''}
        onClick={() => toggleBlockType('dialogue')}
      >
        Dialogue
      </button>
    </div>
  );
}

export default Toolbar;
