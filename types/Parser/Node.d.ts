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
    toString({ trim, tab, eol }?: {
        trim?: boolean | undefined;
        tab?: string | undefined;
        eol?: string | undefined;
    }): any;
}
import ContainerObject from "../Object/ContainerObject.js";
