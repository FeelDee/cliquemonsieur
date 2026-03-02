let monsieursCount = 0;

let monsieursList = [
    {
        file: 'monsieurs/apt-moo.png',
        occurrences: 20,
    },
    {
        file: 'monsieurs/astromonsieur.jpg',
        occurrences: 10,
    },
    {
        file: 'monsieurs/JoeLeBoxeur.png',
        occurrences: 10,
    },
    {
        file: 'monsieurs/shrug.jpeg',
        occurrences: 5
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

    let magicNumber = Math.random() * totalOccurrences;

    while (lastRange && magicNumber >= lastRange.min && magicNumber < lastRange.max) {
        magicNumber = Math.random() * totalOccurrences;
    }

    monsieursList.forEach(monsieur => {
        if (magicNumber >= monsieur.min && magicNumber < monsieur.max) {
            lastRange = { min: monsieur.min, max: monsieur.max };
            document.getElementById('monsieur').src = monsieur.file;
        }
    });
}

document.addEventListener("DOMContentLoaded", onLoad);
