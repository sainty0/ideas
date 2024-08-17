import { Node } from '@tiptap/core';

const Dialogue = Node.create({
  name: 'dialogue',

  group: 'block',
  content: 'text*',
  parseHTML() {
    return [{ tag: 'dialogue' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['dialogue', HTMLAttributes, 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const prevNode = editor.state.selection.$from.nodeBefore;

        // If the previous node is a character name, assume the next line is dialogue
        if (prevNode && prevNode.type.name === 'characterName') {
          editor.chain().focus().setNode('dialogue').run();
          return true;
        }
        return false;
      },
    };
  },
});

export default Dialogue;

