const noteBtn = document.getElementsByClassName("note-btn");
const mainSection = document.getElementsByClassName("main-section");
let mainSectionId = document.querySelector("#mainSection");
const icon = document.getElementsByClassName("icon");
let noteSection = document.querySelector("#noteSection");
let icons = document.getElementsByClassName("side-nav-icon");
let arrayForStorage = [];   // Array med de objekt som går till local storage //
lastNavClick = [];      // Array med den ikon som klickats //
let hidingAndShowingQuill = document.getElementById("hidingAndShowingQuill");
let divInsideToolbar = document.getElementsByClassName("ql-toolbar"); //Div som Quill skapar tillsammans med editor element//
var quill = new Quill('#editor', {        //Quill//
    theme: 'snow'
});
 
window.onload = (updateNoteSectionWithNotes());
 
    // Skapar klick event åt alla ikoner i nav section //
for(i=0;i < icons.length;i++){      //Loopar över ikoner//
    icons[i].addEventListener("click",addContentToNoteSection);
 
    //Uppdaterar innehållet i note-section beroende på vilken ikon som klickats i nav-section.//
    /*
        Lägger den klickade ikonens id som string i en array.
        Sista index i arrayen kontrolleras varje gång man klickan på en ikon
        Gör att notesection inte ska spammas med samma innehåll flera gånger 
    */
    function addContentToNoteSection(e){    //e är det ikon element som klickats.
        console.log(e.target.id)
            if(e.target.id === "settings" && lastNavClick[lastNavClick.length - 1] === "settings"){
                console.log("Settings visas redan")  
            }
            else if(e.target.id === "settings" && lastNavClick[lastNavClick.length - 1] !== "settings"){     //SETTINGS//
                noteSection.innerHTML = "";
                let textFormatSetting = ["Setting3","Setting2","Setting1"];  
                let divAmount = 3; //Ändra siffra när fler settings läggs till -- SKRIV OM TILL textFormatSetting.length -- //
                let i = 0;
                while(i < divAmount){ // FIXA TILL .length //
                    i++;
                    newDiv = document.createElement("div");
                    let oneDiv = textFormatSetting.pop();
                    newDiv.textContent = oneDiv;
                    noteSection.appendChild(newDiv);
                }   
            }
            else if(e.target.id === "seeNotes" && lastNavClick[lastNavClick.length - 1] !== "seeNotes"){     //NOTES//
                noteSection.innerHTML = "";
                updateNoteSectionWithNotes();
            }
        lastNavClick.push(e.target.id)      
    }
}; 
        /* Hittar och lägger upp objekt från tidigare local storage till note-section, 
         Används i search ikon & window.onload */
 
function updateNoteSectionWithNotes(){
        let theStorage = JSON.parse(localStorage.getItem("TextAndTitle") ); 
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
    }
    //Klick event som sparar rubrik och text till localstorage & lägger till i notesection//
noteBtn[0].addEventListener("click", () => {                           
    var noteInputElementTitle = document.createElement("INPUT");     // <-- RUBRIK//
    noteInputElementTitle.setAttribute("type", "text");
    noteInputElementTitle.setAttribute("placeholder", "Title...");
    noteInputElementTitle.setAttribute("id", "inputTitle");
    noteInputElementTitle.classList.add("inputTitle");
 
 
    hidingAndShowingQuill.style.display = "block";
    hidingAndShowingQuill.firstElementChild.appendChild(noteInputElementTitle)
 
 
 
 
    console.log("Clicked!");
 
 
    if (icon[0].name === "pencil") {
        icon[0].name = "save";
 
    } else {
        icon[0].name = "pencil"
        const inputTitle = document.getElementById("inputTitle");
        const inputTitleValue = inputTitle.value;
        const inputTextValueHTML = quill.root.innerHTML;
        const inputTextValue = quill.root.textContent;
        console.log(inputTextValue)
        const input = document.getElementById("editor");
        hidingAndShowingQuill.style.display = "none";    // Gömmer quill //
        quill.deleteText(0,quill.getLength()); //Raderar text i quill annars visas text från tidigare session//
        divInsideToolbar[0].removeChild(noteInputElementTitle) // Raderar titeln//
 
        function createObject(title,text,texthtml){                                      //Constructorfunktion >> skapar objekt att spara i localstorage //
            this.title = title;
            this.text = text;
            this.texthtml = texthtml;
        }
        function saveToStorage(title,text,texthtml){
            let newObject = Object.create(createObject);                                    //Skapar nytt objekt//
            newObject.title = title;                                                        //Lägger in titel och namn//
            newObject.text = text; 
            newObject.texthtml = texthtml;
 
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
        if(inputTitleValue && inputTextValue){                    //Om text skrivits i inputfälten så skickas den till saveToStorage funktionen//
            saveToStorage(inputTitleValue,inputTextValue,inputTextValueHTML) // 1 Titel, 2 Text, 3 Text i html form, 4 tag, 5 favorit,        
        }
        else{
            console.log("empty input")
        };
        inputTitle.remove();
 
    }
})