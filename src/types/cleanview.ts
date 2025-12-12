import {
  CommentElement,
  HimalayaElement,
  NodeElement,
  TextElement,
} from "./himalaya";

export type ParserOptions = {
  secondTry?: boolean;
  includeTags?: string[];
  forbiddenClasses?: string[];
  includeClasses?: boolean;
  url?: string;
  minRatio?: number;
};

export type CustomNodeElement = NodeElement & {
  insidePre?: boolean;
  id?: number;
  parentId?: number;
  children: Array<CustomNodeElement | TextElement | CommentElement>;
};

export type IterateFunction = (
  child: CustomNodeElement,
  options: ParserOptions,
  parent: CustomNodeElement
) => CustomNodeElement;

export type RecursiveFunc = (
  children: HimalayaElement[],
  options: ParserOptions,
  func: RecursiveFunc
) => HimalayaElement[];
