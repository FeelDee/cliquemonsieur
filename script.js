let monsieursCount = 0;

let monsieursList = [
    {
        file: 'monsieurs/baboune.png',
        occurrences: 10,
    },
    {
        file: 'monsieurs/bobby.png',
        occurrences: 1,
    },
    {
        file: 'monsieurs/felix.png',
        occurrences: 10,
    },
    {
        file: 'monsieurs/hagrid.png',
        occurrences: 10,
    },
    {
        file: 'monsieurs/robert.png',
        occurrences: 10,
    },
    {
        file: 'monsieurs/vampire.png',
        occurrences: 10,
    }
];

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

document.addEventListener("DOMContentLoaded", onLoad);
