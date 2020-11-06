import { AdventOutput } from '../common/common';

export default function(input: readonly string[]): AdventOutput {
    let floor = 0;
    let reached_basement = null;
    for (let i = 0; i < input[0].length; i++) {
        if (input[0][i] == '(') {
            floor++;
        } else {
            floor--;
        }
        if (floor == -1 && !reached_basement) {
            reached_basement = i + 1;
        }
    }
    return {part1: String(floor), part2: String(reached_basement)};
}
