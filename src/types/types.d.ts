import type { HimalayaElement } from "./himalaya";

declare module "himalaya" {
  export function parse(content: string): HimalayaElement;
  export function stringify(nodes: HimalayaElement): string;
}
