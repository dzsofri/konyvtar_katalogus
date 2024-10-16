document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search); // Query paraméterek kinyerése
    const bookId = params.get('id'); // ID kinyerése a query paraméterekből

    if (!bookId) {
        alert('A könyv ID-ja nem található.');
        return; // Ha nincs ID, akkor leállítjuk a további végrehajtást
    }

    // Könyv adatainak betöltése
    fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba történt a könyv adatainak betöltésekor.');
            }
            return response.json();
        })
        .then(book => {
            document.getElementById('bookTitle').value = book.title;
            document.getElementById('releaseDate').value = book.releasedate;
            document.getElementById('ISBNnumber').value = book.ISBN;
        })
        .catch(error => console.error('Hiba a könyv adatai betöltésekor:', error));

    // Módosítás mentése
    document.getElementById('saveChanges').addEventListener('click', function() {
        const updatedData = {
            title: document.getElementById('bookTitle').value,
            releasedate: document.getElementById('releaseDate').value,
            ISBN: document.getElementById('ISBNnumber').value,
        };

        fetch(`http://localhost:3000/books/${bookId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (response.ok) {
                alert('A könyv módosítása sikerült!');
                window.location.href = '/Frontend/views/konyvek.html'; // Átirányítás a főoldalra
            } else {
                alert('Hiba történt a módosítás során.');
            }
        })
        .catch(error => console.error('Hiba a módosítás során:', error));
    });
});
