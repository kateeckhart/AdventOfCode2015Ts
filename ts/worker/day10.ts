import { AdventOutput } from '../common/common';
import { Uint8Vector, reverseSubarray } from 'utility';

function lookSayRound(init: string): () => number {
    let prev_numbers = Uint8Vector();
    let new_numbers = Uint8Vector();
    
    for (let char of init) {
        prev_numbers.push(char.charCodeAt(0) - '0'.charCodeAt(0));
    }

    return () => {
        let curr_digit = prev_numbers.get(0);
        let digit_count = 1;
        for (let i = 1; i <= prev_numbers.length; i++) {
            let new_digit;
            if (i == prev_numbers.length) {
                new_digit = 10;
            } else {
                new_digit = prev_numbers.get(i);
            }
            if (new_digit != curr_digit) {
                let count_begin = new_numbers.length;
                while (digit_count != 0) {
                    let curr_count_digit = digit_count % 10;
                    digit_count = Math.floor(digit_count / 10);
                    new_numbers.push(curr_count_digit);
                }
                reverseSubarray(new_numbers.view, count_begin, new_numbers.length);
                new_numbers.push(curr_digit);
                curr_digit = new_digit;
                digit_count = 1;
            } else {
                digit_count++;
            }
        }
        let tmp = prev_numbers;
        prev_numbers = new_numbers;
        new_numbers = tmp;
        new_numbers.clear();
        return prev_numbers.length;
    };
}

export default function(input: readonly string[]) {
    let look_say = lookSayRound(input[0]);
    for (let i = 0; i < 39; i++) {
        look_say();
    }
    let part1 = String(look_say());
    for (let i = 0; i < 9; i++) {
        look_say();
    }
    let part2 = String(look_say());
    return {part1, part2};
}
