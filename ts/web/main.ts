import { AdventWorkerJob, AdventRes, adventResIsOk, AdventOutput, AdventErr } from '../common/common'
import domReady from '../../js/domReady'

let worker: Worker;
let day_select: HTMLSelectElement;
let input_upload: HTMLInputElement;
let run: HTMLElement;
let error_container: HTMLElement;
let error_text: HTMLElement;
let part1_container: HTMLElement;
let part1_ans: HTMLElement;
let part2_container: HTMLElement; 
let part2_ans: HTMLElement;

function error(err: string) {
    part1_container.classList.add('hidden');
    part2_container.classList.add('hidden');
    error_container.classList.remove('hidden');
    error_text.innerText = err;
}

function runDay() {
    let file = input_upload.files![0];
    if (file.size > 1024 * 1024) {
        error('Input is too big');
        return;
    }
    let dayN = day_select.selectedIndex + 1;
    file.text().then((text) => {
        worker.postMessage({input: text, dayN: dayN});
    }, (err) => {
        error(err.toString());
    })
}

domReady(() => {

    day_select = document.getElementById('day-select') as HTMLSelectElement;
    input_upload = document.getElementById('input-file') as HTMLInputElement;
    run = document.getElementById('run-button')!;
    error_container = document.getElementById('error')!;
    error_text = document.getElementById('error-text')!;
    part1_container = document.getElementById('part1')!;
    part1_ans = document.getElementById('part1-ans')!;
    part2_container = document.getElementById('part2')!;
    part2_ans = document.getElementById('part2-ans')!;
    run.addEventListener('click', runDay);

    worker = new Worker('ts/worker/loader.js');
    worker.addEventListener('message', (msg: MessageEvent<AdventRes>) => {
        let res = msg.data;
        if (adventResIsOk(res)) {
            part1_container.classList.remove('hidden');
            error_container.classList.add('hidden');
            part1_ans.innerText = res.part1;
            if (res.part2) {
                part2_container.classList.remove('hidden');
                part2_ans.innerText = res.part2;
            } else {
                part2_container.classList.add('hidden');
            }
        } else {
            error(res.message);
        }
    });
});
