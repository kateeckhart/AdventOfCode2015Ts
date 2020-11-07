import { AdventOutput } from '../common/common';

let vowels = ['a', 'e', 'i', 'o', 'u'];
let naughty_substrings = ['ab', 'cd', 'pq', 'xy'];

export default function(input: readonly string[]): AdventOutput {
    let part1 = 0;
    for (let string of input) {
        let vowel_count = 0;
        let double_letter = false;
        let naughty_substring = false;
        for (let char of string) {
            if (vowels.indexOf(char) >= 0) {
                vowel_count++;
            }
        }
        for (let i = 0; i < string.length - 1; i++) {
            if (string[i] == string[i + 1]) {
                double_letter = true;
            }
            if (naughty_substrings.indexOf(string.substring(i, i + 2)) >= 0) {
                naughty_substring = true;
                break;
            }
        }
        if (vowel_count >= 3 && double_letter && !naughty_substring) {
            part1++;
        }
    }
    let part2 = 0;
    for (let string of input) {
        let pair = false;
        let gap_letter = false;
        for (let i = 0; i < string.length - 2; i++) {
            if (string[i] == string[i + 2]) {
                gap_letter = true;
            }
            for (let j = i + 2; j < string.length; j++) {
                if (string[i] == string[j] && 
                    string[i + 1] == string[j + 1]) {
                    pair = true;
                    break;
                }
            }
        }
        if (pair && gap_letter) {
            part2++;
        }
    }
    return { part1: part1.toString(), part2: part2.toString() };
}
