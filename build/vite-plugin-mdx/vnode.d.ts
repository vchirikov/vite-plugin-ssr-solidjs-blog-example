/** Virtual DOM node which is used by satori */
interface VNode {
  type: string;
  props: {
    style?: Record<string, unknown>;
    children?: string | VNode | VNode[];
    [prop: string]: unknown;
  };
}