let tbody = document.querySelector('#tbody');
let index = 1;

// Könyvek betöltése
function LoadData() {
    return new Promise((resolve, reject) => {
        tbody.innerHTML = '';
        let xhr = new XMLHttpRequest(); 

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
                    let td7 = document.createElement('td'); 

                    td1.innerHTML = (index++) + '.';  
                    td2.innerHTML = `<p id='title_${item.ID}'>${item.title}</p>`;
                    td3.innerHTML = `<p id='releasedate_${item.ID}'>${item.releasedate}</p>`;
                    td4.innerHTML = `<p id='ISBN_${item.ID}'>${item.ISBN}</p>`;
                    td5.innerHTML = item.authorNames || 'Nincs szerző'; 
                    
                    // Módosítás gomb
                    let updateBtn = document.createElement('a'); 
                    updateBtn.classList.add('btn', 'btn-primary');
                    updateBtn.textContent = 'Módosítás';
                    updateBtn.href = `/Frontend/views/konyvModositas.html?id=${item.ID}`; // ID átadása
                    td6.appendChild(updateBtn);
                    
                    // Törlés gomb
                    let deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('btn', 'btn-danger');
                    deleteBtn.textContent = 'Törlés';
                    deleteBtn.addEventListener('click', function() {
                        deleteItem(item.ID);
                    });
                    td7.appendChild(deleteBtn);

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);
                    tr.appendChild(td7);
                    tbody.appendChild(tr);
                });

                resolve(); 
            } else if (xhr.readyState == 4 && xhr.status !== 200) {
                reject('Adatok betöltése sikertelen!');
            }
        };
    });
}

// Törlés funkció
function deleteItem(id) {
    return new Promise((resolve, reject) => {
        if (confirm('Biztosan törölni szeretnéd ezt a könyvet?')) {
            let xhr = new XMLHttpRequest(); 
            xhr.open('DELETE', `http://localhost:3000/books/${id}`, true);
            xhr.send();

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        alert('A könyv törlése sikeres!');
                        index = 1;
                        LoadData(); 
                        resolve(); 
                    } else {
                        alert('Törlés nem sikerült: ' + xhr.responseText);
                        reject('Törlés sikertelen!'); 
                    }
                }
            };
        }
    });
}

// Az oldal betöltésekor
window.onload = function() {
    LoadData()
        .then(() => {
            console.log('Adatok sikeresen betöltve');
        })
        .catch((error) => {
            console.log(error);
        });
};
