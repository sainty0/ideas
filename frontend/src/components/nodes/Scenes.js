import { Node } from '@tiptap/core';

const Scene = Node.create({
  name: 'scene',
  group: 'block',
  content: 'block+',

  parseHTML() {
    return [
      { tag: 'div[data-type="scene"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'scene' }, 0]
  },
});

export default Scene;
