export default Node;
/**
 * ──  Generic tree node that every format will start from
 * ──  { content:string, children:Array<GenericNode> }
 */
declare class Node extends ContainerObject {
    constructor({ content, children }?: {
        content?: string | undefined;
        children?: any[] | undefined;
    });
    /** @type {string} */
    content: string;
}
import ContainerObject from "../Object/ContainerObject.js";
