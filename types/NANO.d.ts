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
     * Parses the NANO format into an object
     * @throws {Error} If invalid format
     * @param {string | Array} input - Input in NANO format
     * @returns {any} - Parsed JavaScript object
     */
    static parse(input: string | any[]): any;
    /**
     * Stringifies any input object into .nano format
     * @param {*} input - Input object to stringify
     * @returns {string} - NANO formatted string
     */
    static stringify(input: any): string;
}
