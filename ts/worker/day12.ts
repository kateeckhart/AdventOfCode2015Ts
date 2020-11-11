import { AdventOutput } from '../common/common';

function decendObject(obj: unknown, remove_red: boolean): number {
    let sum = 0;
    if (obj === null) {
    } else if (Array.isArray(obj)) {
        for (let elem of obj) {
            sum += decendObject(elem, remove_red);
        }
    } else if (typeof obj === 'object') {
        for (let prop of Object.keys(obj!)) {
            sum += decendObject((obj as any)[prop], remove_red);
            if (remove_red && (obj as any)[prop] === 'red') {
                sum = 0;
                break;
            }
        }
    } else if (typeof obj === 'number') {
        sum = obj;
    }
    return sum;
}

export default function (input: string[]): AdventOutput {
    let parsed = JSON.parse(input[0]);
    let part1  = String(decendObject(parsed, false));
    let part2 = String(decendObject(parsed, true));
    return {part1, part2};
}
