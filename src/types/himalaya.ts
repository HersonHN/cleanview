export type Attribute = {
  key: string;
  value?: string;
};

export type TextElement = {
  type: "text";
  content: string;
};

export type CommentElement = {
  type: "comment";
  content: string;
};

export type NodeElement = {
  type: "element";
  tagName: string;
  children: HimalayaElement[];
  attributes: Attribute[];
};

export type HimalayaElement = TextElement | CommentElement | NodeElement;
