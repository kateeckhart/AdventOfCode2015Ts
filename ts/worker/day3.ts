import { AdventOutput } from '../common/common'

class Santa {
    x: number;
    y: number;
    homes: Set<number>
    constructor(homes: Set<number>) {
        this.x = 0;
        this.y = 0;
        this.homes = homes;
    }

    movePos(char: string) {
        switch (char) {
            case '^':
                this.y++;
                break;
            case 'v':
                this.y--; 
                break;
            case '<':
                this.x--;
                break;
            case '>':
                this.x++;
                break;
            default:
                throw 'Invalid input';
        }
        let location = (this.x + 2**16) + (this.y + 2**16) * 2**16;
        this.homes.add(location);
    }
}

export default function (input: readonly string[]) : AdventOutput {
    let homes = new Set<number>();
    let santa = new Santa(homes);
    homes.add(2**16 + 2**16 * 2**16);
    for (let char of input[0]) {
        santa.movePos(char);
    }
    let part1 = String(homes.size);
    homes.clear();
    homes.add(2**16 + 2**16 * 2**16);
    santa = new Santa(homes);
    let robo_santa = new Santa(homes);
    let robo_move = false;
    for (let char of input[0]) {
        if (robo_move) {
            robo_santa.movePos(char);
        } else {
            santa.movePos(char);
        }
        robo_move = !robo_move;
    }
    return {part1: part1, part2: String(homes.size)};
}
