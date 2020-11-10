import { AdventOutput } from '../common/common';
import { nextPermutation } from 'utility';

let regex = /(\w+) to (\w+) = (\d+)/;

let max_id = 0;

class Location {
    id: number;
    locations_to: number[] = [];

    constructor() {
        this.id = max_id;
        max_id++;
    }
    compare(rhs: Location): number {
        return this.id - rhs.id;
    }
}

function locCompare(lhs: Location, rhs: Location): number {
    return lhs.compare(rhs);
}

export default function (input: readonly string[]): AdventOutput {
    let locations_map = new Map<string, Location>();
    for (let line of input) {
        let match = regex.exec(line);
        if (!match) {
            throw 'Input error';
        }
        let location_a = locations_map.get(match[1]);
        let location_b = locations_map.get(match[2]);

        if (!location_a) {
            location_a = new Location();
            locations_map.set(match[1], location_a);
        }
        if (!location_b) {
            location_b = new Location();
            locations_map.set(match[2], location_b);
        }
        let distance = Number(match[3]);
        location_a.locations_to[location_b.id] = distance;
        location_b.locations_to[location_a.id] = distance;
    }
    let locations_arr = Array.from(locations_map.values());
    locations_arr.sort(locCompare);
    let min_route = Infinity;
    let max_route = 0;
    do {
        let route = 0;
        for (let i = 1; i < locations_arr.length; i++) {
            let from = locations_arr[i - 1];
            let to = locations_arr[i];
            route += from.locations_to[to.id];
        }
        if (route < min_route) {
            min_route = route;
        }
        if (route > max_route) {
            max_route = route;
        }
    } while (nextPermutation(locations_arr, locCompare));

    return {part1: String(min_route), part2: String(max_route)};
}
