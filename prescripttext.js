const prescriptDict = {};
const bgDict = {};
const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);

document.addEventListener("DOMContentLoaded", () => {
    const prescriptTexts = document.querySelectorAll('.prescript');
    writeText(prescriptTexts, 35);
    makeText(1);
});

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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
        console.log("finished");
        setTimeout(finishText, 1000, value[0], 1);
        delete bgDict[cur_key];
        return;
    }
    else {
        bgDict[temp] = [value[0], value[1]];

    }
    delete bgDict[cur_key];
    setTimeout(continueSingleText, interval, temp, interval);
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

    setTimeout(continueText, interval, p, interval);
}

async function makeText(size) {
    const cur_text = document.createElement("div");

    cur_text.textContent = "";
    const templen = randInt(5, 10);
    for (let i = 0; i < templen; i++) {
        cur_text.textContent += String.fromCharCode(randInt(97, 97 + 25));
    }

    cur_text.className = "bgtext";

    cur_text.style.left = `${randInt(0, window.innerWidth - cur_text.offsetWidth)}px`;
    cur_text.style.top = `${randInt(0, window.innerHeight - cur_text.offsetHeight)}px`;

    document.body.appendChild(cur_text);

    setTimeout(writeSingleText, randInt(100, 200), cur_text, 35);
}

async function finishText(element, i) {
    const s = "_CLEAR._";
    let temp = "";
    for (let i = 0; i < 8; i++) {
        temp += String.fromCharCode(randInt(97, 97 + 52));
    }
    element.textContent = s.substring(0, i) + temp.substring(0, 8 - i);
    if (i < 8) {
        setTimeout(finishText, 35, element, i + 1);
    }
}