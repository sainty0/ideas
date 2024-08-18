
import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';

const mySchema = new Schema({
  nodes: basicSchema.spec.nodes.append({
    sceneHeading: {
      content: "text*",
      group: "block",
      toDOM() { return ["h1", { class: "scene-heading" }, 0]; },
      parseDOM: [{ tag: "h1.scene-heading" }]
    },
    actionBlock: {
      content: "text*",
      group: "block",
      toDOM() { return ["p", { class: "action-block" }, 0]; },
      parseDOM: [{ tag: "p.action-block" }]
    },
    dialogue: {
      content: "text*",
      group: "block",
      toDOM() { return ["p", { class: "dialogue" }, 0]; },
      parseDOM: [{ tag: "p.dialogue" }]
    },
    character: {
      content: "text*",
      group: "block",
      toDOM() { return ["p", { class: "character-name" }, 0]; },
      parseDOM: [{ tag: "p.character-name" }]
    },
    bullet_list: {
      group: "block",
      content: "list_item+",
      toDOM() { return ["ul", 0]; },
      parseDOM: [{ tag: "ul" }]
    },
    ordered_list: {
      group: "block",
      content: "list_item+",
      attrs: { order: { default: 1 } },
      toDOM(node) { return ["ol", { start: node.attrs.order }, 0]; },
      parseDOM: [{
        tag: "ol",
        getAttrs(dom) { return { order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 }; }
      }]
    },
    list_item: {
      content: "paragraph block*",
      toDOM() { return ["li", 0]; },
      parseDOM: [{ tag: "li" }]
    }
  }),
  marks: basicSchema.spec.marks.append({
    bold: {
      toDOM: () => ["strong", 0],
      parseDOM: [{ tag: "strong" }]
    },
    italic: {
      toDOM: () => ["em", 0],
      parseDOM: [{ tag: "em" }]
    }
  })
});

export default mySchema;
