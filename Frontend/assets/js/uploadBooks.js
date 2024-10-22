function LoadAuthors() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest(); 
        xhr.open('GET', 'http://localhost:3000/authors', true);
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    const authors = JSON.parse(xhr.responseText);
                    const authorSelect = document.querySelector('#authorName');

                    authors.forEach(author => {
                        const option = document.createElement('option');
                        option.value = author.ID;
                        option.textContent = author.name; 
                        authorSelect.appendChild(option);
                    });

                    resolve();
                } else {
                    reject('Hiba a szerzők betöltésekor: ' + xhr.statusText);
                }
            }
        };
    });
}

function Upload() {
    return new Promise((resolve, reject) => {
    
        const title = document.querySelector('#bookTitle').value;
        const releasedate = document.querySelector('#releaseDate').value;
        const ISBN = document.querySelector('#ISBNnumber').value;
        const authorID = document.querySelector('#authorName').value; 
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

        let xhr = new XMLHttpRequest(); 
        xhr.open('POST', 'http://localhost:3000/books', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 201) { 
                    
                    document.querySelector('#bookTitle').value = "";
                    document.querySelector('#releaseDate').value = "";
                    document.querySelector('#ISBNnumber').value = "";
                    document.querySelector('#authorName').value = ""; 
                    resolve('Adatok sikeresen feltöltve!');
                    window.location.href = '/Frontend/views/konyvek.html'; 
                    console.error('Adatok feltöltése sikertelen!', xhr.responseText); 
                    alert(xhr.responseText);
                    reject('Adatok feltöltése sikertelen!');
                }
            }
        };
    });
}


window.onload = function() {
    LoadAuthors()
    .then(() => {
        console.log('Szerzők sikeresen betöltve');
    })
    .catch(error => {
        console.error(error);
    });
};
