const noteBtn = document.getElementsByClassName("note-btn");
const mainSection = document.getElementsByClassName("main-section");
const icon = document.getElementsByClassName("icon");
let globalStorage;
let arrayForStorage = [];    
 
 window.onload = (() =>{                // window.onload hittar och lägger upp "title & text" objekt från tidigare local storage till note-section elementet //
    let theStorage = globalStorage = JSON.parse(localStorage.getItem("TextAndTitle") ); 
 
    if(theStorage){
        for(i=0;i < theStorage.length;i++){
            let createDiv = document.createElement("div");
            let createTitle = document.createElement("h4");
            let createP = document.createElement("p"); 
            let windowObjFromStorage = theStorage[i];                     // Hämtar ett objekt                                      //
            let windowObjectArray = (Object.values(windowObjFromStorage)); //Objektet är nu en array med 2 index. Titel och text     //
            createTitle.textContent = windowObjectArray[0];               // Använder index för att lägga titel o text i sina taggar //
            createP.textContent = windowObjectArray[1];
            noteSection.appendChild(createDiv);
            createDiv.appendChild(createTitle)
            createDiv.appendChild(createP)
            noteSection.appendChild(createDiv);
            arrayForStorage.push(windowObjectArray);
        } 
    }
    else if(theStorage == null){
        console.log("Det finns inga sparade objekt")
    }
})
 
noteBtn[0].addEventListener("click", () => {                           // Klick event 
    


    var noteInputElementTitle = document.createElement("INPUT");    
    noteInputElementTitle.setAttribute("type", "text");
    noteInputElementTitle.setAttribute("placeholder", "Title...");
    noteInputElementTitle.setAttribute("id", "inputTitle");
    var noteInputElement = document.createElement("textarea");
    noteInputElement.setAttribute("type", "text");
    noteInputElement.setAttribute("id", "input");
    noteInputElement.setAttribute("placeholder", "Note...");
    // noteInputElement.setAttribute("value", "test");
    // console.log(mainSection);
    // console.log(noteInputElement);
    mainSection[0].appendChild(noteInputElementTitle)
    mainSection[0].appendChild(noteInputElement)
    noteInputElementTitle.classList.add("inputTitle");
    noteInputElement.classList.add("input");
    console.log("Clicked!");
    // console.log(icon[0]);
    if (icon[0].name === "pencil") {
        icon[0].name = "save"
 
    } else {
        icon[0].name = "pencil"
        mainSection[0].removeChild(noteInputElementTitle)
        mainSection[0].removeChild(noteInputElement)
        const inputTitle = document.getElementById("inputTitle");
        const input = document.getElementById("input");
 
        function createObject(title,text){                                      //Constructorfunktion >> skapar objekt att spara i localstorage //
            this.title = title;
            this.text = text;
        }
        function saveToStorage(title,text){
            let newObject = Object.create(createObject);                                    //Skapar nytt objekt//
            newObject.title = title;                                                        //Lägger in titel och namn//
            newObject.text = text;               
            arrayForStorage.push(newObject)                                                 //Lägger in objektet i tom array och sparar array i localstorage //
            localStorage.setItem("TextAndTitle", JSON.stringify(arrayForStorage)); 
            let createDiv = document.createElement("div");
            let createTitle = document.createElement("h4");
            let createP = document.createElement("p");   
            createTitle.textContent = (arrayForStorage[arrayForStorage.length - 1].title)              
            createP.textContent = (arrayForStorage[arrayForStorage.length - 1].text)        
            noteSection.appendChild(createDiv);
            createDiv.appendChild(createTitle)
            createDiv.appendChild(createP)
            noteSection.appendChild(createDiv)                                   //Lägger det senast tilllagda objektet högst i note-section div// 
        } 
        if(inputTitle.value && input.value){                    //Om text skrivits i inputfälten så skickas den till saveToStorage funktionen//
            saveToStorage(inputTitle.value,input.value)         
        }
        else{
            console.log("empty input")
        };
        inputTitle.remove();
        input.remove();
    }
})
 