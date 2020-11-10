export interface Arrayish<T> extends Iterable<T> {
    [index: number] : T;
    readonly length: number; 
}

export function reverseSubarray<T>(array: Arrayish<T>, begin: number, end: number): void {
    end--;
    while (begin < end) {
        let tmp = array[begin];
        array[begin] = array[end];
        array[end] = tmp;
        begin++;
        end--;
    }
}

export function nextPermutation<T>(array: Arrayish<T>, compare: (lhs: T, rhs: T) => number): boolean {
    let k;
    for (k = array.length - 2; k >= 0; k--) {
        if (compare(array[k], array[k + 1]) < 0) {
            break;
        }
    }
    if (k < 0) {
        return false;
    }
    let i;
    for (i = array.length - 1; i > k; i--) {
        if (compare(array[k], array[i]) < 0) {
            break;
        }
    }
    let tmp = array[k];
    array[k] = array[i];
    array[i] = tmp;
    reverseSubarray(array, k + 1, array.length);
    return true;
}

type ArrayConstructor<T> = (buffer: ArrayBuffer, length: number) => T;

interface TypedArray extends Arrayish<number> {
    readonly buffer: ArrayBuffer
}

class InternalTypedVector<T extends TypedArray> {
    #array_constructor: ArrayConstructor<T>;
    #data: T;
    #length: number = 0;
    constructor(array_constructor: ArrayConstructor<T>) {
        this.#array_constructor = array_constructor;
        this.#data = this.#array_constructor(new ArrayBuffer(0), 0);
    }

    get length(): number {
        return this.#length;
    }

    get capacity(): number {
        return this.#data.length;
    }

    get view(): T {
        return this.#array_constructor(this.#data.buffer, this.length);
    }

    get(index: number): number {
        if (index >= this.length) {
            throw new RangeError();
        }
        return this.#data[index];
    }

    set(index: number, value: number): void {
        if (index >= this.length) {
            throw new RangeError();
        }
        this.#data[index] = value;
    }

    push(value: number): void {
        if (this.length == this.capacity) {
            let new_capacity = this.capacity * 2;
            if (new_capacity == 0) {
                new_capacity = 1;
            }
            this.reserve(new_capacity);
        }
        this.#data[this.length] = value;
        this.#length++;
    }

    pop(): number {
        if (this.length == 0) {
            throw 'Poped an empty vector.';
        }
        this.#length--;
        return this.#data[this.length];
    }

    reserve(new_capacity: number): void {
        if (new_capacity <= this.capacity) {
            return;
        }
        this.resize(new_capacity);
    }
    
    compact(): void {
        this.resize(this.length);
    }

    clear(): void {
        this.#length = 0;
    }

    private resize(new_capacity: number): void {
        if (new_capacity <= this.length) {
            return;
        }
        let arr_cons = this.#array_constructor;
        let new_buffer = new ArrayBuffer(new_capacity);
        let new_data = arr_cons(new_buffer, new_capacity);
        for (let i = 0; i < this.length; i++) {
            new_data[i] = this.#data[i];
        }
        this.#data = new_data;
    }

    [Symbol.iterator](): Iterator<number> {
        return this.view[Symbol.iterator]();
    }
}

export interface TypedVector<T> extends Iterable<number> {
    length: number;
    capacity: number;
    view: T;

    get(index: number): number;
    set(index: number, value: number): void;
    push(value: number): void;
    pop(): number;
    clear(): void;
    compact(): void;
    reserve(count: number): void;
}

export function Uint8Vector(init?: Iterable<number>): TypedVector<Uint8Array> {
    let ret = new InternalTypedVector(
        (buffer, length) => new Uint8Array(buffer, 0, length));
    if (init) {
        let any_init = init as any;
        if (any_init.length && typeof any_init.length === 'number') {
            ret.reserve(any_init.length);
        }
        for (let item of init) {
            ret.push(item);
        }
    }
    return ret;
}

