import { Node } from '@tiptap/core';

const CustomParagraph = Node.create({
  name: 'customParagraph',

  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', HTMLAttributes, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitBlock(),
    };
  },
});

export default CustomParagraph;

