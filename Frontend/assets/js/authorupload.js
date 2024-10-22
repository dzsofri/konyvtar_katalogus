

// fajankó feltöltése
function Upload(){
 let xhr = new XMLHttpRequest(); 
    var data = JSON.stringify({
       name:document.querySelector('#authorName').value,
       birthdate:document.querySelector('#authorBirthDate').value,

    });
 
    xhr.open('POST', 'http://localhost:3000/authors', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
 
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 200){
                
                document.querySelector('#authorName').value="";
                document.querySelector('#authorBirthDate').value="";
                
            }else{
                alert(xhr.responseText);
                index = 1;
                window.location.href = '/Frontend/views/index.html'; 
            }
        }
    }
 
 
};