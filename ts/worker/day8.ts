import { AdventOutput } from '../common/common';

export default function (input: readonly string[]): AdventOutput {
    let code_len = 0;
    let mem_len = 0;
    for (let line of input) {
        code_len += line.length;
        let i = 1;
        while (i < line.length - 1) {
            i++;
            mem_len++;
            if (line[i - 1] != '\\') {
                continue;
            }
            if (line[i] == 'x') {
                i += 2;
            }
            i++;
        }
    }
    let double_enc_len = 0;
    for (let line of input) {
        double_enc_len += 2;
        for (let char of line) {
            double_enc_len++;
            if (char == '\\' || char == '"') {
                double_enc_len++;
            }
        }
    }
    return { 
        part1: String(code_len - mem_len),
        part2: String(double_enc_len - code_len)
    };
}
