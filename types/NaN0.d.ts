export default NaN0;
declare class NaN0 {
    static NEW_LINE: string;
    static TAB: string;
    static EMPTY_ARRAY: string;
    static EMPTY_DATE: string;
    static EMPTY_OBJECT: string;
    static MULTILINE_START: string;
    static VALUE_DELIMITER: string[];
    static COMMENT_START: string;
    /**
     * Parses the NaN0 format into an object
     * @throws {Error} If invalid format
     * @param {string} input - Input in NaN0 format
     * @returns {any} - Parsed JavaScript object
     */
    static parse(input: string): any;
    /**
     * Stringifies any input object into .NaN0 format
     * @param {*} input - Input object to stringify
     * @returns {string} - NaN0 formatted string
     */
    static stringify(input: any): string;
}
