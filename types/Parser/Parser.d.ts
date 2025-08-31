export default Parser;
/**
 * Base class that knows how to:
 *   1️⃣ read an indentation string,
 *   2️⃣ build a generic tree from a multiline text,
 *   3️⃣ stringify that tree again.
 *
 * Concrete parsers (NaN0, Markdown, …) inherit from it and
 * transform the generic tree into their own domain objects.
 */
declare class Parser {
    /** default line‑break & tab characters – override in ctor if you need something else */
    static EOL: string;
    static TAB: string;
    static SKIP: string[];
    static findTab(str: any, tabs?: (string | number)[], eol?: string): string;
    /**
     * @param {object} input
     * @param {string} [input.eol="\n"]
     * @param {string} [input.tab="  "]
     * @param {Array<string | Function>} [input.skip=[""]]
     */
    constructor(input?: {
        eol?: string | undefined;
        tab?: string | undefined;
        skip?: (string | Function)[] | undefined;
    });
    /** @type {string} */
    eol: string;
    /** @type {string} */
    tab: string;
    /** @type {Array<string | Function>} */
    skip: Array<string | Function>;
    /**
     * Indentation calculator.
     * Returns how many *tab‑units* (default two spaces) the line starts with.
     * @param {string} str
     * @param {string[]} [prevRows=[]]
     * @returns {number}
     */
    readIndent(str: string, prevRows?: string[] | undefined): number;
    /**
     * Build the generic tree.
     * @param {string} text
     * @returns {Node}
     */
    decode(text: string): Node;
    /**
     * Stringify the generic tree.
     * @param {Node} node
     * @param {object} options
     * @param {number} [options.indent=0]
     * @returns {string}
     */
    encode(node: Node, options?: {
        indent?: number | undefined;
    }): string;
}
import Node from "./Node.js";
