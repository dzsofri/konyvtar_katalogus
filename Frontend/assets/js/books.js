let tbody = document.querySelector('tbody');
var xhr = new XMLHttpRequest();
let index = 1;

function LoadData() {
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
                
               

                td1.innerHTML = (index++) + '.';

                // Szerkeszthető input mezők minden sorhoz
                td2.innerHTML = `<p  id='title_${item.ID}' >${item.title}</p>`;
                td3.innerHTML = `<p  id='relesedate_${item.ID}'>${item.relesedate}</p>`;
                td4.innerHTML = `<p  id='ISBN_${item.ID}'>${item.ISBN}</p>`;
                

             

                // Módosítás/Mentés gomb hozzáadása
                let updateBtn = document.createElement('button');
                updateBtn.classList.add('btn', 'btn-primary');
                updateBtn.textContent = 'Módosítás';
                updateBtn.addEventListener('click', function() {
                  
                
                        saveChanges(item.id, updateBtn);
                    
                });

                td5.appendChild(updateBtn);

                // Törlés gomb
                let deleteBtn = document.createElement('button');
                deleteBtn.classList.add('btn', 'btn-danger');
                deleteBtn.textContent = 'Törlés';
                deleteBtn.addEventListener('click', function() {
                    deleteItem(item.id);
                });

                td6.appendChild(deleteBtn);
                
                tbody.appendChild(tr);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);
               
            });

          
        }
    };
}

LoadData();