export default Node;
/**
 * ──  Generic tree node that every format will start from
 * ──  { content:string, children:Array<Node> }
 */
declare class Node extends ContainerObject {
    constructor(input?: {});
    /** @type {string} */
    content: string;
    /** @type {Node[]} */
    children: Node[];
    /** @type {number} */
    indent: number;
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
import ContainerObject from "../Object/ContainerObject.js";
