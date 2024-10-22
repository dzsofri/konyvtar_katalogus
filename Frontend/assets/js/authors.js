let tbody = document.querySelector('tbody');
var xhr = new XMLHttpRequest();
let index = 1;
 
function LoadData() {
    return new Promise((resolve, reject) => {
       
            tbody.innerHTML = '';
            xhr.open('GET', 'http://localhost:3000/authors', true);
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
                       
                        td1.innerHTML = (index++) + '.';
                        td2.innerHTML = `<p id='name_${item.ID}'>${item.name}</p>`;
                        td3.innerHTML = `<p id='birthdate_${item.ID}'>${item.birthdate}</p>`;  
                       
                        // Módosítás/Mentés gomb hozzáadása
                        let updateBtn = document.createElement('a');
                    updateBtn.classList.add('btn', 'btn-primary');
                    updateBtn.textContent = 'Módosítás';
                    updateBtn.href = `/Frontend/views/authorUpdate.html?id=${item.ID}`; // Az ID átadása a módosító oldalra
                    td4.appendChild(updateBtn);
 
                        // Törlés gomb
                        let deleteBtn = document.createElement('button');
                        deleteBtn.classList.add('btn', 'btn-danger');
                        deleteBtn.textContent = 'Törlés';
                        deleteBtn.addEventListener('click', function() {
                            deleteItem(item.ID);
                        });
                        td5.appendChild(deleteBtn);
 
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        tr.appendChild(td4);
                        tr.appendChild(td5);
                        tbody.appendChild(tr);
                    });
 
                    resolve();
                } else if (xhr.readyState == 4 && xhr.status !== 200) {
                    reject('Adatok betöltése sikertelen!');
                }
            };
       
    });
}
 



//fajankók törlése
function deleteItem(id) {
    return new Promise((resolve, reject) => {
        if (confirm('Biztosan törölni szeretnéd ezt a szerzőt?')) {
            let xhr = new XMLHttpRequest(); 
            xhr.open('DELETE', `http://localhost:3000/authors/${id}?timestamp=${new Date().getTime()}`, true);
            xhr.send();

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        alert('A szerző törlése sikeres!');
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
