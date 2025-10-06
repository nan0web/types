export default ContainerObject;
/**
 * Represents a generic hierarchical container.
 *
 * @class ContainerObject
 */
declare class ContainerObject {
    /**
     * Factory method that returns an existing instance or creates a new one.
     *
     * @param {object|ContainerObject} [props={}]
     * @returns {ContainerObject}
     */
    static from(props?: object | ContainerObject): ContainerObject;
    /**
     * @param {object} props
     * @param {Array} [props.children=[]]
     * @param {number} [props.level=0]
     */
    constructor(props?: {
        children?: any[] | undefined;
        level?: number | undefined;
    });
    /** @type {Array} */
    children: any[];
    /** @type {number} */
    level: number;
    /**
     * Returns the most recent (deepest) container.
     *
     * @returns {ContainerObject}
     */
    get recent(): ContainerObject;
    /**
     * Adds element to the container.
     * @param {*} element
     * @returns {ContainerObject}
     */
    add(element: any): ContainerObject;
    /**
     * Removes the element from the container.
     * @param {*} element
     * @returns {this}
     */
    remove(element: any): this;
    clear(): this;
    /**
     * Finds an element by filter.
     *
     * @param {(v:any)=>boolean} filter
     * @param {boolean} [recursively=false]
     * @returns {*}
     */
    find(filter?: (v: any) => boolean, recursively?: boolean | undefined): any;
    /**
     * Flattens the tree into an array.
     *
     * @returns {ContainerObject[]}
     */
    flat(): ContainerObject[];
    toArray(): ContainerObject[];
    /**
     * Filters children.
     *
     * @param {(v:any)=>boolean} [filter=()=>true]
     * @param {boolean} [recursively=false]
     * @returns {Array}
     */
    filter(filter?: ((v: any) => boolean) | undefined, recursively?: boolean | undefined): any[];
    /**
     * Maps over children.
     *
     * @param {(value: ContainerObject, index: number, arr: ContainerObject[]) => any[]} callback
     * @param {boolean} [recursively=false]
     * @returns {Array}
     */
    map(callback: (value: ContainerObject, index: number, arr: ContainerObject[]) => any[], recursively?: boolean | undefined): any[];
    /**
     * Asynchronously maps over children.
     *
     * @param {(value: ContainerObject, index: number, arr: ContainerObject[]) => Promise<any[]>} callback
     * @param {boolean} [recursively=false]
     * @returns {Promise<Array>}
     */
    asyncMap(callback: (value: ContainerObject, index: number, arr: ContainerObject[]) => Promise<any[]>, recursively?: boolean | undefined): Promise<any[]>;
}
