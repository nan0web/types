/**
 * @typedef {Object} Context
 * @property {Array<{ text: string, id: string }>} comments
 * @property {number} [i]
 * @property {string} [next]
 */
/**
 * NaN0 format - "0 is not a number" - zero is a universe that is a source of any
 * other numbers and else.
 * The word rea1 means subjective reality, because everyone's reality is different.
 * The word g0d means god as infinite energy and everything else is a part of it.
 * So there is no objective reality until everyone becomes an only one that is g0d.
 * Becomes here means rea1ize the rea0ity.
 * @example The top level element of NaN0 document can be any of NaN0 types.
 *          NaN0 document is useful in cases of storing pure data such as types:
 *          boolean, number, string, date, object, array, array of previous types.
 *          These types can cover most of business cases when structuring data into
 *          classes and nested and connected business logic as it is in rea1 life.
 */
export default class NaN0 {
    static NEW_LINE: string;
    static TAB: string;
    static EMPTY_ARRAY: string;
    static EMPTY_DATE: string;
    static EMPTY_OBJECT: string;
    static MULTILINE_START: string;
    static VALUE_DELIMITER: (string | RegExp)[];
    static COMMENT_START: string;
    static numberRegex: RegExp;
    static dateRegex: RegExp;
    static parseValue(str: any): any;
    static formatValue(value: any): string;
    /**
     * @param {string} text
     * @param {string | RegExp | Array<string | RegExp>} condition
     * @returns {{ condition: string | RegExp, name: string } | false}
     */
    static match(text: string, condition: string | RegExp | Array<string | RegExp>): {
        condition: string | RegExp;
        name: string;
    } | false;
    static parseComments(allChildren: any, startIdx?: number): {
        comments: string;
        nextIdx: string;
        i: number;
    };
    /**
     * @param {any[]} allChildren
     * @param {number} level
     * @param {Context} context
     * @returns {any}
     */
    static parseContainer(allChildren: any[], level?: number, context?: Context): any;
    /**
     *
     * @param {any[]} allChildren
     * @param {number} level
     * @param {Context} [context]
     * @returns
     */
    static parseObjectWithComments(allChildren: any[], level?: number, context?: Context | undefined): {};
    /**
     *
     * @param {any[]} allChildren
     * @param {number} level
     * @param {Context} context
     * @returns
     */
    static parseArrayWithComments(allChildren: any[], level?: number, context?: Context): any[];
    static addValueToNode(parent: any, value: any, level: any, key: any): void;
    static addArrayItemToNode(parent: any, item: any, level: any): void;
    /**
     * Parses the NaN0 format into an object or array
     * @throws {Error} If invalid format
     * @param {string} input - Input in NaN0 format
     * @param {Context} context
     * @returns {any} - Parsed JavaScript value (object or array)
     */
    static parse(input: string, context?: Context): any;
    /**
     * Stringifies any input object or array into .NaN0 format
     * @throws {Error} If input is not a non-null object or array
     * @param {Object|Array} input - Input object or array
     * @param {Context} context
     * @returns {string} - NaN0 formatted string
     */
    static stringify(input: any | any[], context?: Context): string;
}
export type Context = {
    comments: Array<{
        text: string;
        id: string;
    }>;
    i?: number | undefined;
    next?: string | undefined;
};
