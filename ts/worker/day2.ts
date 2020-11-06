import { AdventOutput } from '../common/common';

export default function(input: readonly string[]): AdventOutput {
    let paper = 0;
    let ribbon = 0;
    for (let present of input) {
        let sides = present.split('x');
        let length = Number(sides[0]);
        let width = Number(sides[1]);
        let height = Number(sides[2]);

        let area_a = length * width;
        let area_b = length * height;
        let area_c = width * height;
        paper += 2 * (area_a + area_b + area_c);
        paper += Math.min(area_a, area_b, area_c);

        let perimeter_a = length + width;
        let perimeter_b = length + height;
        let perimeter_c = width + height;

        ribbon += 2 * Math.min(perimeter_a, perimeter_b, perimeter_c);
        ribbon += length * width * height;
    }
    return {part1: String(paper), part2: String(ribbon)};
}
