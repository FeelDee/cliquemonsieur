let monsieursCount = 0;
let totalOccurrences = 0;

function onLoad() {
    console.log("(╯°□°)╯︵ ┻━┻");

    monsieursList.forEach(({file, occurrences}, index) => {
        monsieursList[index].min = totalOccurrences;
        monsieursList[index].max = totalOccurrences + occurrences;
        totalOccurrences += occurrences;
    });
}

let lastRange;

function cliqueMonsieur() {
    monsieursCount += 1;
    document.getElementById('compte-monsieur').innerText = 'Nombre de Monsieurs: ' + monsieursCount;

    shake();

    do {
        magicNumber = Math.random() * totalOccurrences;
    } while (lastRange && magicNumber >= lastRange.min && magicNumber < lastRange.max)

    monsieursList.forEach(monsieur => {
        if (magicNumber >= monsieur.min && magicNumber < monsieur.max) {
            lastRange = { min: monsieur.min, max: monsieur.max };
            document.getElementById('monsieur').src = monsieur.file;
            changeFavicon(monsieur.file);
        }
    });
}

let shaking = false;

function shake() {
    if (shaking) return;
    shaking = true;

    document.body.classList.add("shake");

    setTimeout(() => {
        document.body.classList.remove("shake");
        shaking = false;
    }, 200);
}

function changeFavicon(src) {
    const link = document.head.querySelector("link[rel~='icon']");
    document.head.removeChild(link);

    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.type = 'image/x-icon';
    newLink.href = src;

    document.head.appendChild(newLink);
}

let currentPage = 'clique';

function navigate(page) {
    if (page == currentPage) return;

    document.getElementById(`${currentPage}-nav`).classList.remove('active-nav');
    document.getElementById(`${page}-nav`).classList.add('active-nav');

    document.getElementById(`${currentPage}-page`).classList.add('hidden');
    document.getElementById(`${page}-page`).classList.remove('hidden');

    currentPage = page;
}

document.addEventListener("DOMContentLoaded", onLoad);
