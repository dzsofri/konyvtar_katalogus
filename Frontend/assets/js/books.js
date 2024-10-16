let tbody = document.querySelector('#tbody');


var xhr = new XMLHttpRequest();
let index = 1;

function LoadData() {
    return new Promise((resolve, reject) => {
        tbody.innerHTML = '';
        xhr.open('GET', 'http://localhost:3000/books', true);
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var items = JSON.parse(xhr.responseText);

                items.forEach(item => {
                    let tr = document.createElement('tr'); 
                    let td1 = document.createElement('td'); 
                    let td2 = document.createElement('td'); 
                    let td3 = document.createElement('td'); 
                    let td4 = document.createElement('td'); 
                    let td5 = document.createElement('td'); 
                    let td6 = document.createElement('td');
                    
                    td1.innerHTML = (index++) + '.';  // Sorszám

                    // Szerkeszthető input mezők minden sorhoz
                    td2.innerHTML = `<input type='text' class="form-control" id='title_${item.ID}' value='${item.title}' />`;
                    td3.innerHTML = `<input type='date' class="form-control" id='releasedate_${item.ID}' value='${item.releasedate}' />`;
                    td4.innerHTML = `<input type='text' class="form-control" id='ISBN_${item.ID}' value='${item.ISBN}' />`;

                    // Módosítás/Mentés gomb hozzáadása, most linkként
                    let updateBtn = document.createElement('a'); 
                    updateBtn.classList.add('btn', 'btn-primary');
                    updateBtn.textContent = 'Módosítás';
                    updateBtn.href = `/Frontend/views/konyvModositas.html?id=${item.ID}`; // Az ID átadása a módosító oldalra
                    td5.appendChild(updateBtn);
                    
                    // Törlés gomb
                    let deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('btn', 'btn-danger');
                    deleteBtn.textContent = 'Törlés';
                    deleteBtn.addEventListener('click', function() {
                        deleteItem(item.ID);
                    });
                    td6.appendChild(deleteBtn);

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);
                    tbody.appendChild(tr);
                });

                resolve(); 
            } else if (xhr.readyState == 4 && xhr.status !== 200) {
                reject('Adatok betöltése sikertelen!');
            }
        };
    });
}




// Módosítás mentése
function saveChanges(id) {
    return new Promise((resolve, reject) => {
        var updatedData = JSON.stringify({
            title: document.querySelector(`#title_${id}`).value,
            releasedate: document.querySelector(`#releasedate_${id}`).value,
            ISBN: document.querySelector(`#ISBN_${id}`).value,
        });

        xhr.open('PATCH', `http://localhost:3000/books/${id}`, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(updatedData);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    alert('Sikeres frissítés');
                    LoadData();
                    index = 1;
                    resolve(); 
                } else if (xhr.status !== 200) {
                    reject('Adatok módosítása sikertelen!');
                }
            }
        };
    });
}

function deleteItem(id) {
    return new Promise((resolve, reject) => {
        if (confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
            xhr.open('DELETE', `http://localhost:3000/books/${id}`, true);
            xhr.send();

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                       LoadData()
                        index = 0;
                    } else {
                        alert('Törlés nem sikerült: ' + xhr.responseText);
                    }
                    resolve(); 
                } else if (xhr.readyState == 4 && xhr.status !== 200) {
                    reject('Adatok betöltése sikertelen!');
                }
            };
        }
    });
}

function Upload() {
    return new Promise((resolve, reject) => {
      
        var data = JSON.stringify({ 
            title: document.querySelector('#bookTitle').value,
            releasedate: document.querySelector('#releaseDate').value,  
            ISBN: document.querySelector('#ISBNnumber').value,
        });

       
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/books', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 202) {
                    
                    // Kiürítjük a mezőket
                    document.querySelector('#bookTitle').value = "";
                    document.querySelector('#releaseDate').value = "";
                    document.querySelector('#ISBNnumber').value = "";
                    resolve('Adatok sikeresen feltöltve!');
                } else {
                    alert(xhr.responseText);
                    reject('Adatok feltöltése sikertelen!');
                }
            }
        };
    });
}

LoadData()
    .then(() => {
        console.log('Adatok sikeresen betöltve');
    })
    .catch((error) => {
        console.log(error);
    });
