
const form = document.getElementById("transactionForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    if(form.transactionAmount.value > 0) {                                       
        let transactionFormData = new FormData(form);
        let transactionObj = convertFormDataToTransactionObj(transactionFormData)
        saveTransactionObj(transactionObj)      
        insertRowInTransactionTable(transactionObj);
        form.reset();
    }else {
        alert("estas ingresando un numero menor a 0")
    }                                    
})


function draw_category() {                                                                    
    let allCategories = ["Salario", "Alquiler", "Comida", "Diversion", "Gasto imprevisto", "Tramsporte"];
    for(let index = 0; index < allCategories.length; index++) {
        insertCategory(allCategories[index]);
    }

}


function insertCategory(categoryName) {                                     
    const selectElement = document.getElementById("transactionCategory");
    //  let category = "option",>" + categoryName + "</option>"              
    let htmlToInsert = `<option> ${categoryName} </option>`;                    
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert);           
}



// En vez de obterlo del localstorage lo obtenemos del servidor
/**
document.addEventListener("DOMContentLoaded", function(event){
    draw_category();  
    //Obtienen desde el local storage la informacion de las transaciones                                                           
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    transactionObjArr.forEach(
        function(arrayElement){
            insertRowInTransactionTable(arrayElement);
        }
    )
})
*/

document.addEventListener("DOMContentLoaded", function(event){
    draw_category();
    //Obtien las transacciones del servidor                                                          
    fetch("http://localhost:3000/transactions").then(res => res.json()).then(data => mostarEnPantallaArrayDeTransacciones(data))
})

// En vez de obtenerla del local storage la obtengo del servidor

function mostarEnPantallaArrayDeTransacciones(transactionObjArr) {
    transactionObjArr.forEach(
        function(arrayElement){
            insertRowInTransactionTable(arrayElement);
        }
    )
}



function getTransactionsFromApi() {
    //Llama al backend
    //Obtene las transacciones
    //y guardalas en un array 
    const allTransactions = fetch("http:/localhost:3000/transactions");    //Cambiamos =[] por el fetch
    return allTransactions;
}

function getNewTransactionId() {                                                
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";   
    let newTransactionId = JSON.parse(lastTransactionId) + 1;                  
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;
}


function convertFormDataToTransactionObj(transactionFormData) {
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("transactionDescription");
    let transactionAmount = transactionFormData.get("transactionAmount");
    let transactionCategory = transactionFormData.get("transactionCategory");
    let transactionId = getNewTransactionId();
        return {
            "transactionType": transactionType,
            "transactionDescription": transactionDescription,
            "transactionAmount": transactionAmount,
            "transactionCategory": transactionCategory,
            "transactionId": transactionId
    }
}


function insertRowInTransactionTable(transactionObj) {
    let transactionTableRef = document.getElementById("transactionTable");
    
    let newTransactionRowRef = transactionTableRef.insertRow(-1);
        
    newTransactionRowRef.setAttribute("data-transaction-Id", transactionObj["transactionId"]);  

    let newTypeCellRef = newTransactionRowRef.insertCell(0);                 
    newTypeCellRef.textContent = transactionObj["transactionType"];

    newTypeCellRef = newTransactionRowRef.insertCell(1);        
    newTypeCellRef.textContent = transactionObj["transactionDescription"];

    newTypeCellRef = newTransactionRowRef.insertCell(2);        
    newTypeCellRef.textContent = transactionObj["transactionAmount"];

    newTypeCellRef = newTransactionRowRef.insertCell(3);        
    newTypeCellRef.textContent = transactionObj["transactionCategory"];


    let newDeleteCell = newTransactionRowRef.insertCell(4);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton);

    deleteButton.addEventListener("click",(event) => {
        let transactionRow = event.target.parentNode.parentNode;    
        let transactionId = transactionRow.getAttribute("data-transaction-Id")                      
        transactionRow.remove() ;  
        deleteTransactionObj(transactionId);                                                               
    })                                                                                                               
}
 

function deleteTransactionObj(transactionId) {
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    let transactionIndexInArr = transactionObjArr.findIndex(element => element.transactionId == transactionId);
    transactionObjArr.splice(transactionIndexInArr, 1);                                                        
    let transactionArrayJSON = JSON.stringify(transactionObjArr);  
    localStorage.setItem("transactionData", transactionArrayJSON);   
}


function saveTransactionObj(transactionObj) {
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];  
    myTransactionArray.push(transactionObj);
    let transactionArrayJSON = JSON.stringify(myTransactionArray);  
    localStorage.setItem("transactionData", transactionArrayJSON);  
}

fetch("http://localhost:3000/transactions");    

/* Da error por la politica del CORS, no esta presente el encabezado en la respuesta del servidor
Busco en internet: Access-Control-Allow-Origin, y utilizo cualquiera, en nuestro caso el origen
es: http://localhost:3000. El navegador tiene una politica llamada del mismo origen
Same Origin Police (SOP). Si haces una request con Fetch o Ajax desde javascript a
 a una url/api, tiene que tener el mismo origen el servidor y lo que tenes en el navegador (la
pagina que cargas). En el cliente tenemos HTML, CSS JAVASCRIPT IMAGENES FUENTES, etc.
La clave esta en hacer la Api publica, para que sea libre para todo el mundo, pero no siempre 
queres esto, por eso, por defecto no es publica (por seguridad).

Instalamos el cors. en la consola: npm install cors, podemos ver que se instalo en el package.json
Vamos a la pagina cors node y agregamos en el index.js:

const cors = require('cors')    //El cors agrega el 'Access-Control-Allow-Origin' a los encabezados
app.use(cors())                                          

el Access-Control-Allow-Origin: *   Significa que yodos pueden acceder (el *)
esto de permitir a todos, no es lo mejor, por es se puede autarizar a una determinada pagina para que acceda, 
o a mas paginas.
Por ejemplo: Access-Control-Allow-Origin: [http://www.kk123.com, http://bancokk456.com]
Se puede ver todo esto en laq documentacion del CORS https://www.npmjs.com/package/cors
*/