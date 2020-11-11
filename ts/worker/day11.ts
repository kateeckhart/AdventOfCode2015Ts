import { AdventOutput } from '../common/common';

let bad_letters = new Uint8Array(
    ['i', 'o', 'l'].map(x => x.charCodeAt(0)));

function validPassword(password: Uint8Array): boolean {
    for (let char of password) {
        if (bad_letters.indexOf(char) >= 0) {
            return false;
        }
    }
    let straight = false;
    for (let i = 0; i < password.length - 2; i++) {
        if (password[i] == password[i + 1] - 1 && 
            password[i + 1] == password[i + 2] - 1) {
            straight = true;
            break;
        }
    }
    if (!straight) {
        return false;
    }
    let i = 0;
    let pairs = 0;
    while (i < password.length - 1) {
        if (password[i] == password[i + 1]) {
            pairs++;
            i++;
        }
        i++;
    }
    return pairs >= 2;
}

function nextPassword(password: Uint8Array): string {
    do {
        for (let i = password.length - 1; i >= 0; i--) {
            password[i]++;
            if (password[i] <= 'z'.charCodeAt(0)) {
                break;
            }
            password[i] = 'a'.charCodeAt(0);
        }
    } while (!validPassword(password));

    return password.reduce((acc, x) => acc + String.fromCharCode(x), '');
}

export default function (input: readonly string[]): AdventOutput {
    let password = new Uint8Array(input[0].length);
    for (let i = 0; i < input[0].length; i++) {
        password[i] = input[0].charCodeAt(i);
    }

    let part1 = nextPassword(password);
    let part2 = nextPassword(password);
    return {part1, part2};
}
