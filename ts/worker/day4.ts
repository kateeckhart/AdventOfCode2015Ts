import { AdventOutput } from '../common/common'

let shift_table = new Uint8Array([7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]);

let constant_table = new Int32Array(64);
for (let i = 0; i < 64; i++) {
    constant_table[i] = (2 ** 32 * Math.abs(Math.sin(i + 1))) | 0;
}

function leftRotate(x: number, c: number): number {
    return ((x << c) | (x >>> (32 - c)));
}

class Md5Digester {
    a0: number = 0x67452301 | 0;
    b0: number = 0xefcdab89 | 0;
    c0: number = 0x98badcfe | 0;
    d0: number = 0x10325476 | 0;

    digestChunk(raw_chunk: Uint8Array) {
        let chunk = new Int32Array(16);
        let view = new DataView(raw_chunk.buffer, raw_chunk.byteOffset, raw_chunk.byteLength);
        for (let i = 0; i < 16; i++) {
            chunk[i] = view.getInt32(i * 4, true);
        }
        let a = this.a0;
        let b = this.b0;
        let c = this.c0;
        let d = this.d0;
        for (let i = 0; i < 64; i++) {
            let f;
            let g;
            if (i < 16) {
                f = (b & c) | (~b & d);
                g = i;
            } else if (i < 32) {
                f = (d & b) | (~d & c);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                f = b ^ c ^ d;
                g = (3 * i + 5) % 16;
            } else {
                f = c ^ (b | ~d);
                g = (7 * i) % 16;
            }
            f += a + constant_table[i] + chunk[g];
            f |= 0;
            a = d;
            d = c;
            c = b;
            b += leftRotate(f, shift_table[i]);
            b |= 0;
        }
        this.a0 += a;
        this.a0 |= 0;
        this.b0 += b;
        this.b0 |= 0;
        this.c0 += c;
        this.c0 |= 0;
        this.d0 += d;
        this.d0 |= 0;
    }
}

function Md5(input: string): Uint8Array {
    let input_array = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
        input_array[i] = input.charCodeAt(i);
    }
    let digest = new Md5Digester();
    for (let i = 0; i < input_array.length + 1; i += 64) {
        if (i + 63 > input_array.length) {
            let chunk = new Uint8Array(128);
            let j;
            for (j = i; j < input_array.length; j++) {
                chunk[j - i] = input_array[j];
            }
            chunk[j] = 0x80;
            j++;
            while (j % 64 != 56) {
                chunk[j] = 0;
                j++;
            }
            let length_view = new DataView(chunk.buffer);
            length_view.setUint32(j, input.length * 8, true);
            j += 4;
            while (j % 64 != 0) {
                chunk[j] = 0;
                j++;
            }
            digest.digestChunk(chunk.subarray(0, 64));
            if (j == 128) {
                digest.digestChunk(chunk.subarray(64, 128));
            }
        } else {
            digest.digestChunk(input_array.subarray(i, i + 64));
        }
    }
    let ret = new Uint8Array(16);
    let ret_view = new DataView(ret.buffer);
    ret_view.setInt32(0, digest.a0, true);
    ret_view.setInt32(4, digest.b0, true);
    ret_view.setInt32(8, digest.c0, true);
    ret_view.setInt32(12, digest.d0, true);
    return ret;
}

export default function(input: readonly string[]): AdventOutput {
    let part1 = 1;
    while (true) {
        let md5 = Md5(input[0] + String(part1));
        if (md5[0] == 0 && md5[1] == 0 && (md5[2] & 0xf0) == 0) {
            break;
        }
        part1++;
    }
    let part2 = part1;
    while (true) {
        let md5 = Md5(input[0] + String(part2));
        if (md5[0] == 0 && md5[1] == 0 && md5[2] == 0) {
            break;
        }
        part2++;
    }

    return {
        part1: String(part1),
        part2: String(part2)
    };
}
