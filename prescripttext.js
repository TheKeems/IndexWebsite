const prescriptDict = {};
const bgDict = {};
const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);

const pendingTimers = new Map();
let nextTimerId = 0;
let paused = document.hidden;

function pTimeout(fn, delay, ...args) {
    const id = nextTimerId++;
    const timer = {fn, args, remaining: delay, start: Date.now(), handle: null};
    pendingTimers.set(id, timer);

    if (!paused) {
        timer.handle = setTimeout(fire, delay, id);
    }

    return id;
}

function fire(id) {
    const timer = pendingTimers.get(id);
    pendingTimers.delete(id);
    timer.fn(...timer.args);
}

document.addEventListener("visibilitychange", () => {
    const now = Date.now();

    if (document.hidden) {
        paused = true;
        pendingTimers.forEach(timer => {
            clearTimeout(timer.handle);
            timer.handle = null;
            timer.remaining = Math.max(0, timer.remaining - (now - timer.start));
        });
    }
    else {
        paused = false;
        pendingTimers.forEach((timer, id) => {
            timer.start = now;
            timer.handle = setTimeout(fire, timer.remaining, id);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const prescriptTexts = document.querySelectorAll('.prescript');
    writeText(prescriptTexts, 35);

    makeText(1);
    makeText(1);
    makeText(1);
    makeText(1);
    makeText(1);
});

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//i dont need this to be super efficient since im realistically only using this for vw so this is gonna go up to 100
function randIntIntervals(min, max, intervals){
    const range = Array(max - min + 1).fill(0);
    intervals.sort((a, b) => a[0] - b[0]);

    for (const key in intervals) {
        if(intervals[key][0] >= min){
            range[intervals[key][0] - min]++;
        }
        if(intervals[key][1] <= max){
            range[intervals[key][1] - min]--;
        }
    }

    let psum = 0;
    const valid = [];
    for (let i = min; i <= max; i++) {
        psum += range[i - min];
        
        if(psum == 0){
            valid.push(i);
        }
    }

    
    return valid[randInt(0, valid.length)];
}

async function writeText(e, interval) {
    let p = e.length;
    e.forEach(element => {
        let temp = "";
        let s = element.textContent;
        for (let i = 0; i < element.textContent.length; i++) {
            temp += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        }
        prescriptDict[temp] = [element, s];
        element.textContent = temp.substring(0, Math.min(8, temp.length));
    });

    continueText(p, interval);
}

async function writeSingleText(element, interval) {
    let temp = "";
    let s = element.textContent;
    for (let i = 0; i < element.textContent.length; i++) {
        temp += String.fromCharCode(Math.floor(Math.random() * 52) + 97);
    }
    element.textContent = temp.substring(0, Math.min(8, temp.length));
    bgDict[temp] = [element, s];

    continueSingleText(temp, interval);
}

async function continueSingleText(t, interval) {
    const cur_key = t;
    const value = bgDict[cur_key];
    let temp = "";
    for (let i = 0; i < cur_key.length - 1; i++) {
        temp += String.fromCharCode(randInt(97, 97 + 26));
    }

    value[0].textContent = value[1].substring(0, value[1].length - temp.length) + temp.substring(0, Math.min(8, temp.length));
    if (temp.length == 0) {
        //timeout before bg prescript disappears
        pTimeout(finishText, 1000, value[0], 1);
        delete bgDict[cur_key];
        return;
    }
    else {
        bgDict[temp] = [value[0], value[1]];
    }
    delete bgDict[cur_key];
    pTimeout(continueSingleText, interval, temp, interval);
}

async function continueText(p, interval) {
    Object.entries(prescriptDict).forEach(async ([cur_key, value]) => {
        let temp = "";
        for (let i = 0; i < cur_key.length - 1; i++) {
            temp += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        }
        value[0].textContent = value[1].substring(0, value[1].length - temp.length) + temp.substring(0, Math.min(8, temp.length));
        if (temp.length == 0) {
            p--;
        }
        else {
            prescriptDict[temp] = [value[0], value[1]];
        }
        delete prescriptDict[cur_key];
    });

    pTimeout(continueText, interval, p, interval);
}


async function makeText(size) {
    const cur_text = document.createElement("div");

    cur_text.textContent = "";
    const templen = randInt(5, 10);
    for (let i = 0; i < templen; i++) {
        cur_text.textContent += String.fromCharCode(randInt(97, 97 + 25));
    }

    cur_text.className = "bgtext";

    const par = randInt(0, 1);

    if(!par){
        cur_text.style.left = `${randIntIntervals(0, 100, [[40, 70], [85, 100]])}vw`;
        cur_text.style.top = `${randIntIntervals(0, 100, [[90, 100]])}vw`;
    }
    else{
        cur_text.style.left = `${randIntIntervals(0, 100, [[85, 100]])}vw`;
        cur_text.style.top = `${randIntIntervals(0, 100, [[30, 70], [90, 100]])}vw`;
    }

    
    //cur_text.style.left = `${randInt(0, window.innerWidth - cur_text.offsetWidth)}px`;
    //cur_text.style.top = `${randInt(0, window.innerHeight - cur_text.offsetHeight)}px`;

    document.body.appendChild(cur_text);

    pTimeout(writeSingleText, randInt(100, 200), cur_text, 35);
    pTimeout(makeText, randInt(1000, 2000), 2);
}

async function finishText(element, i) {
    const s = "_CLEAR._";
    let temp = "";
    for (let i = 0; i < 8; i++) {
        temp += String.fromCharCode(randInt(97, 97 + 52));
    }
    element.textContent = s.substring(0, i) + temp.substring(0, 8 - i);
    if (i < 8) {
        pTimeout(finishText, 35, element, i + 1);
    }
    else{
        pTimeout(removeDiv, 1000, element);
    }
}

async function removeDiv(element){
    element.remove();
}