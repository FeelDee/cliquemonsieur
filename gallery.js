class GalleryCard extends HTMLElement {
    connectedCallback() {
        const img = document.createElement('img');
        img.src = this.getAttribute('imageSrc');
        this.appendChild(img);

        const name = document.createElement('p');
        name.innerHTML = this.getAttribute('name');
        this.appendChild(name);

        const occurrences = document.createElement('p');
        occurrences.innerHTML = this.getAttribute('occurrences');
        this.appendChild(occurrences);
    }
}

customElements.define("gallery-card", GalleryCard);

const galleryList = document.getElementById("gallery-list");

function galleryCreateCard({ name, occurrences, timestamp, blob }) {
    const el = document.createElement("gallery-card");
    
    el.setAttribute("name", name);
    el.setAttribute("occurrences", occurrences);
    el.setAttribute("imageSrc", URL.createObjectURL(blob));
    galleryList.appendChild(el);
}

async function galleryInit() {
    const monsieurs = await storageGetAllMonsieurs();
    monsieurs.forEach(galleryCreateCard);
}

onMonsieurSave.subscribe(galleryCreateCard);

galleryInit().then(() => console.log('gallery init successful'));
