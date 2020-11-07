import { AdventOutput } from '../common/common';

let regex = /^((?:turn off)|(?:turn on)|(?:toggle)) (\d+),(\d+) through (\d+),(\d+)$/;

export default function(input: readonly string[]): AdventOutput {
    let lights = new Uint8Array(1000 * 1000);
    for (let ins of input) {
        let match = regex.exec(ins);
        if (!match) {
            throw 'Input error';
        }
        let x1 = Number(match[2]);
        let y1 = Number(match[3]);
        let x2 = Number(match[4]);
        let y2 = Number(match[5]);
        switch (match[1]) {
            case 'turn off':
                for (let i = x1; i <= x2; i++) {
                    for (let j = y1; j <= y2; j++) {
                        lights[i + 1000 * j] = 0;
                    }
                }
                break;
            case 'turn on':
                for (let i = x1; i <= x2; i++) {
                    for (let j = y1; j <= y2; j++) {
                        lights[i + 1000 * j] = 1;
                    }
                }
                break;
            case 'toggle':
                for (let i = x1; i <= x2; i++) {
                    for (let j = y1; j <= y2; j++) {
                        let index = i + 1000 * j;
                        if (lights[index] == 0) {
                            lights[index] = 1;
                        } else {
                            lights[index] = 0;
                        }
                    }
                }
                break;
            default:
                throw 'Regex error';
        }
    }

    let part1 = lights.reduce((acc, val) => {
        return acc + val;
    });
    for (let i = 0; i < lights.length; i++) {
        lights[i] = 0;
    }
    for (let ins of input) {
        let match = regex.exec(ins)!;
        let x1 = Number(match[2]);
        let y1 = Number(match[3]);
        let x2 = Number(match[4]);
        let y2 = Number(match[5]);
        switch (match[1]) {
            case 'turn off':
                for (let i = x1; i <= x2; i++) {
                    for (let j = y1; j <= y2; j++) {
                        let index = i + 1000 * j;
                        if (lights[index] > 0) {
                            lights[index]--;
                        }
                    }
                }
                break;
            case 'turn on':
                for (let i = x1; i <= x2; i++) {
                    for (let j = y1; j <= y2; j++) {
                        lights[i + 1000 * j]++;
                    }
                }
                break;
            case 'toggle':
                for (let i = x1; i <= x2; i++) {
                    for (let j = y1; j <= y2; j++) {
                        lights[i + 1000 * j] += 2 
                    }
                }
                break;
            default:
                throw 'Regex error';
        }
    }
    let part2 = lights.reduce((acc, val) => {
        return acc + val;
    });

    return {part1: String(part1), part2: String(part2)};
}
