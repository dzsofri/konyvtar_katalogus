document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search); // Query paraméterek kinyerése
    const authorID = params.get('id'); // ID kinyerése a query paraméterekből
 
    if (!authorID) {
        alert('A könyv ID-ja nem található.');
        return; // Ha nincs ID, akkor leállítjuk a további végrehajtást
    }
 
    // Könyv adatainak betöltése
    fetch(`http://localhost:3000/authors/${authorID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba történt a könyv adatainak betöltésekor.');
            }
            return response.json();
        })
        .then(author => {
            document.getElementById('authorName').value = author.name;
            document.getElementById('authorBirthDate').value = author.birthdate;
        })
        .catch(error => console.error('Hiba a szerző adatai betöltésekor:', error));
 
    // Módosítás mentése
    document.getElementById('saveChanges').addEventListener('click', function() {
        const updatedData = {
            name: document.getElementById('authorName').value,
            birthdate: document.getElementById('authorBirthDate').value,
        };
 
        fetch(`http://localhost:3000/authors/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (response.ok) {
                alert('A szerző módosítása sikerült!');
                window.location.href = '/Frontend/views/index.html'; // Átirányítás a főoldalra
            } else {
                alert('Hiba történt a módosítás során.');
            }
        })
        .catch(error => console.error('Hiba a módosítás során:', error));
    });
});
 