import { Node } from '@tiptap/core';

const ActionBlock = Node.create({
  name: 'actionBlock',

  group: 'block',
  content: 'text*',
  parseHTML() {
    return [{ tag: 'action-block' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['action-block', HTMLAttributes, 0];
  },
});

export default ActionBlock;

