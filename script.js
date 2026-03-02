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
        monsieursList[index].minRange = totalOccurrences;
        monsieursList[index].maxRange = totalOccurrences + occurrences;
        totalOccurrences += occurrences;
    });
}

function cliqueMonsieur() {
    monsieursCount += 1;
    document.getElementById('compte-monsieur').innerText = 'Nombre de Monsieurs: ' + monsieursCount;

    let magicNumber = Math.random() * totalOccurrences;
    monsieursList.forEach(monsieur => {
        if (magicNumber >= monsieur.minRange && magicNumber < monsieur.maxRange) {
            document.getElementById('monsieur').src = monsieur.file;
        }
    });
}

document.addEventListener("DOMContentLoaded", onLoad);
