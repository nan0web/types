export default class ModelError extends Error {
    fields: Record<string, string>;
    constructor(fields: Record<string, string>);
}
