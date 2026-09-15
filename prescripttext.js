const prescriptDict = {};

document.addEventListener("DOMContentLoaded", () => {
    const prescriptTexts = document.querySelectorAll('.prescript');
    
    writeText(prescriptTexts, 35);
});

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

async function continueText(p, interval) {
    // this thing is HORRIBLY written but im too lazy to refactor it
    Object.entries(prescriptDict).forEach(async ([key, value]) => {
        let temp = "";
        for (let i = 0; i < key.length - 1; i++) {
            temp += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        }
        value[0].textContent = value[1].substring(0, value[1].length - temp.length) + temp.substring(0, Math.min(8, temp.length));
        //console.log(temp.length + " " + temp + " " + j + " " + p + " " + value[0].textContent);
        if (temp.length == 0) {
            p--;
        }
        else {
            prescriptDict[temp] = [value[0], value[1]];
        }
        delete prescriptDict[key];
    });

    setTimeout(continueText, p, interval, interval);
}