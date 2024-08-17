import { Node } from '@tiptap/core';

const CharacterName = Node.create({
  name: 'characterName',

  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div.character-name' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'character-name' }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitBlock(),
    };
  },
});

export default CharacterName;

