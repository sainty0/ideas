import { Node } from '@tiptap/core';

const SceneHeading = Node.create({
  name: 'sceneHeading',

  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'h1.scene-heading' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['h1', { class: 'scene-heading' }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitBlock(),
    };
  },
});

export default SceneHeading;

