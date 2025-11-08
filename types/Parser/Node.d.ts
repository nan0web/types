/**
 * @typedef {Object} NodeInput
 * @property {string} [content=""]
 * @property {Array<Partial<Node>>} [children=[]]
 * @property {number} [indent=0]
 */
/**
 * ──  Generic tree node that every format will start from
 * ──  { content:string, children:Array<Node> }
 */
export default class Node extends ContainerObject {
    /**
     * @param {any} input
     * @returns {Node}
     */
    static from(input: any): Node;
    /**
     *
     * @param {NodeInput} input
     */
    constructor(input?: NodeInput);
    /** @type {string} */
    content: string;
    /** @type {Node[]} */
    children: Node[];
    /** @type {number} */
    indent: number;
    /**
     * Adds element to the container.
     * @param {Partial<Node>} element
     * @returns {Node}
     */
    add(element: Partial<Node>): Node;
    /**
     * Updates indent for all nested children recursively.
     * @private
     */
    private _updateIndent;
    /**
     * Maps over children.
     *
     * @param {(value: Node, index: number, arr: Node[]) => any[]} callback
     * @param {boolean} [recursively=false]
     * @returns {Array}
     */
    map(callback: (value: Node, index: number, arr: Node[]) => any[], recursively?: boolean | undefined): any[];
    /**
     * @param {object} [input]
     * @param {boolean} [input.trim=false]
     * @param {string} [input.tab="\t"]
     * @param {string} [input.eol="\n"]
     * @returns
     */
    toString({ trim, tab, eol }?: {
        trim?: boolean | undefined;
        tab?: string | undefined;
        eol?: string | undefined;
    } | undefined): any;
}
export type NodeInput = {
    content?: string | undefined;
    children?: Partial<Node>[] | undefined;
    indent?: number | undefined;
};
import ContainerObject from "../Object/ContainerObject.js";
