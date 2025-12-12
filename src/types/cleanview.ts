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
};

export type CustomNodeElement = NodeElement & {
  insidePre?: boolean;
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
