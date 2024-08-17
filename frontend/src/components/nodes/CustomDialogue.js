import { Node } from '@tiptap/core';

const CustomDialogue = Node.create({
  name: 'customDialogue',

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

export default CustomDialogue;

