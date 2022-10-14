import Dict = NodeJS.Dict;

export function evalBoolean(boolean: Dict<any>): boolean {
    switch (boolean.type) {
        case 'CONSTANT':
            return boolean.value;
        default:
            throw new Error('Unknown boolean type: ' + boolean.type);
    }
}