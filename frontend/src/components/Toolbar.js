import React from 'react';

export default function Toolbar({ editor, setBlockType }) {
    if(!editor){
        console.log("editor off");
        return null;
    }


    function toggleBlockNode(type) {
        console.log('here');
        setBlockType(type);
        editor.chain().focus().setNode(type).run();
    }

    return (
        <div className="toolbar">
            <button onClick={() => toggleBlockNode('actionBlock')}>Action Block</button>
            <button onClick={() => toggleBlockNode('characterName')}>Character Name</button>
            <button onClick={() => toggleBlockNode('dialogue')}>Dialogue</button>
            <button onClick={() => toggleBlockNode('sceneHeading')}>Scene Heading</button>
        </div>
    );
}


