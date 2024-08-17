import { Node } from '@tiptap/core';

const CharacterName = Node.create({
  name: 'characterName',

  group: 'block',
  content: 'text*',
  parseHTML() {
    return [{ tag: 'character-name' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['character-name', HTMLAttributes, 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const text = editor.getText();
        if (text.match(/^[A-Z\s]+$/)) {
          editor.chain().focus().setNode('characterName').run();
          return true;
        }
        return false;
      },
    };
  },
});

export default CharacterName;

