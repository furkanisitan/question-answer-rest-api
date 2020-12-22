/**
 * @returns {boolean|*} Return false if any arg is empty, or true otherwise.
 */
const isNotEmpty = (...args) => {
    if (args.length === 0) return false;

    return args.reduce((previous, current) => {
        return previous && current;
    });
}

/**
 *
 * @param {string} val
 * @returns {boolean|undefined} get string to boolean
 */
const getBool = (val) => {
    if (_isBool(val))
        return val.toLowerCase() === 'true';
    return undefined;
}

const _isBool = (val) =>
    val.toLowerCase() === 'true' || val === 'false';


module.exports = { isNotEmpty, getBool };