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

            // Szerző beállítása
            const authorSelect = document.querySelector('#authorName');
            if (book.authorID) { // Ellenőrizzük, hogy van-e authorID
                authorSelect.value = book.authorID; // Kiválasztja a megfelelő szerzőt
            }
        })
        .catch(error => console.error('Hiba a könyv adatai betöltésekor:', error));

    // Módosítás mentése
    document.getElementById('saveChanges').addEventListener('click', function() {
        const updatedData = {
            title: document.getElementById('bookTitle').value,
            releasedate: document.getElementById('releaseDate').value,
            ISBN: document.getElementById('ISBNnumber').value,
            authorID: document.querySelector('#authorName').value, // Különböző szerző ID
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

// Szerzők betöltése
function LoadAuthors() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest(); // Új XMLHttpRequest példány
        xhr.open('GET', 'http://localhost:3000/authors', true);
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    const authors = JSON.parse(xhr.responseText);
                    const authorSelect = document.querySelector('#authorName');

                    authors.forEach(author => {
                        const option = document.createElement('option');
                        option.value = author.ID; // Szerző ID
                        option.textContent = author.name; // Szerző neve
                        authorSelect.appendChild(option);
                    });

                    resolve(); // Visszatérünk, ha a betöltés sikeres
                } else {
                    reject('Hiba a szerzők betöltésekor: ' + xhr.statusText);
                }
            }
        };
    });
}

// Az oldal betöltésekor
window.onload = function() {
    LoadAuthors()
    .then(() => {
        console.log('Szerzők sikeresen betöltve');
        
        // Könyv adatainak betöltése és szerző beállítása
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('id');

        if (bookId) {
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

                    // Szerző beállítása
                    const authorSelect = document.querySelector('#authorName');
                    if (book.authorID) { // Ellenőrizzük, hogy van-e authorID
                        authorSelect.value = book.authorID; // Kiválasztja a megfelelő szerzőt
                    }
                })
                .catch(error => console.error('Hiba a könyv adatai betöltésekor:', error));
        }
    })
    .catch(error => {
        console.error(error);
    });
};
