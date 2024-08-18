import React, { useState } from 'react';

const Toolbar = ({ editor, setBlockType, blockType }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const blockTypes = [
        { label: 'Scene Heading', value: 'sceneHeading' },
        { label: 'Action Block', value: 'actionBlock' },
        { label: 'Character Name', value: 'characterName' },
        { label: 'Dialogue', value: 'dialogue' },
    ];

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleBlockTypeChange = (type) => {
        setBlockType(type);
        editor.chain().focus().setNode(type).run();
        setIsDropdownOpen(false);
    };

    const toggleBold = () => {
        editor.chain().focus().toggleBold().run();
    };

    const toggleItalic = () => {
        editor.chain().focus().toggleItalic().run();
    };

    return (
        <div className="toolbar-dropdown">
            <button className="dropdown-toggle" onClick={handleDropdownToggle}>
                {blockTypes.find((type) => type.value === blockType)?.label || 'Select Block Type'}
            </button>

            {isDropdownOpen && (
                <ul className="dropdown-menu">
                    {blockTypes.map((type) => (
                        <li key={type.value}>
                            <button
                                className={`dropdown-item ${blockType === type.value ? 'active' : ''}`}
                                onClick={() => handleBlockTypeChange(type.value)}
                            >
                                {type.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="formatting-buttons">
                <button onClick={toggleBold} className={editor?.isActive('bold') ? 'active' : ''}>
                    Bold
                </button>
                <button onClick={toggleItalic} className={editor?.isActive('italic') ? 'active' : ''}>
                    Italic
                </button>
            </div>
        </div>
    );
};

export default Toolbar;


