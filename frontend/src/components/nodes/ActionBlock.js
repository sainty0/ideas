import { Node } from '@tiptap/core';

const ActionBlock = Node.create({
  name: 'actionBlock',

  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p.action-block' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', { class: 'action-block' }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitBlock(),
    };
  },
});

export default ActionBlock;

