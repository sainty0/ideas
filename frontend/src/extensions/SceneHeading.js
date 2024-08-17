import { Node } from '@tiptap/core';

const SceneHeading = Node.create({
  name: 'sceneHeading',

  group: 'block',
  content: 'text*',
  parseHTML() {
    return [{ tag: 'scene-heading' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['scene-heading', HTMLAttributes, 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const text = editor.getText();
        if (text.match(/^(INT\.|EXT\.)/)) {
          editor.chain().focus().setNode('sceneHeading').run();
          return true;
        }
        return false;
      },
    };
  },
});

export default SceneHeading;
