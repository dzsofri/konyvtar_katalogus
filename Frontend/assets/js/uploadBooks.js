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

function Upload() {
    return new Promise((resolve, reject) => {
        // Ellenőrizd, hogy a mezők nem üresek-e
        const title = document.querySelector('#bookTitle').value;
        const releasedate = document.querySelector('#releaseDate').value;
        const ISBN = document.querySelector('#ISBNnumber').value;
        const authorID = document.querySelector('#authorName').value; // Különböző szerző ID
        console.log(authorID)

        if (!title || !releasedate || !ISBN || !authorID) {
            alert("Minden mező kitöltése kötelező!");
            reject('Adatok feltöltése sikertelen!');
            return;
        }

        var data = JSON.stringify({ 
            title: title,
            releasedate: releasedate,  
            ISBN: ISBN,
            authorID: authorID
        });

        let xhr = new XMLHttpRequest(); // Új XMLHttpRequest példány
        xhr.open('POST', 'http://localhost:3000/books', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 201) { // 201 az újonnan létrehozott erőforrás sikeres válasza
                    // Kiürítjük a mezőket
                    document.querySelector('#bookTitle').value = "";
                    document.querySelector('#releaseDate').value = "";
                    document.querySelector('#ISBNnumber').value = "";
                    document.querySelector('#authorName').value = ""; // Kiürítjük a szerző választását
                    resolve('Adatok sikeresen feltöltve!');
                    window.location.href = '/Frontend/views/konyvek.html'; // Átirányítás a főoldalra
                } else {
                    console.error('Adatok feltöltése sikertelen!', xhr.responseText); // Hiba kiírása
                    alert(xhr.responseText);
                    reject('Adatok feltöltése sikertelen!');
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
    })
    .catch(error => {
        console.error(error);
    });
};
