// set of auxiliary functions that don't belong to any existing class/module

// export function stringToBytes(s) {
function stringToBytes(s) {
    let b = [];
    for (let i = 0; i < s.length; i++)
        b.push(s.charCodeAt(i));
    return b;
}