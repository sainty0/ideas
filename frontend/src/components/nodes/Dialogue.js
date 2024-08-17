import { Node } from '@tiptap/core';

const Dialogue = Node.create({
  name: 'dialogue',

  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div.dialogue' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'dialogue' }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitBlock(),
    };
  },
});

export default Dialogue;

