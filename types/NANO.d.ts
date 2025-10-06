export default NANO;
declare class NANO {
    static NEW_LINE: string;
    static TAB: string;
    static EMPTY_ARRAY: string;
    static EMPTY_OBJECT: string;
    static MULTILINE_START: string;
    static VALUE_DELIMITER: string[];
    static COMMENT_START: string;
    /**
     * Parses a NANO format string into a JavaScript object or value.
     * @param {string} input - Input in NANO format
     * @returns {any} - Parsed JavaScript object or value
     */
    static parse(input: string): any;
    /**
     * Parse a value according to NANO format rules
     * @param {string} value - Value to parse
     * @returns {any} - Parsed value
     */
    static parseValue(value: string): any;
    /**
     * Stringifies any input object into .nano format
     * @param {*} input - Input object to stringify
     * @param {number} indentLevel - Current indentation level
     * @returns {string} - NANO formatted string
     */
    static stringify(input: any, indentLevel?: number): string;
    /**
     * Formats a single value into appropriate NANO format
     * @param {*} value - Value to format
     * @returns {string} - NANO formatted string
     */
    static formatValue(value: any): string;
}
