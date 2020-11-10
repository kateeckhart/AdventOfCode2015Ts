export interface Arrayish<T> {
    [index: number] : T;
    length: number; 
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
    let lower_index = k + 1;
    let upper_index = array.length - 1;
    while (lower_index < upper_index) {
        tmp = array[lower_index];
        array[lower_index] = array[upper_index];
        array[upper_index] = tmp;
        lower_index++;
        upper_index--;
    }
    return true;
}
