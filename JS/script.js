let theBody = document.getElementsByTagName("body");
const noteBtn = document.getElementsByClassName("note-btn");
const mainSection = document.getElementsByClassName("main-section");
let mainSectionWrapper = document.getElementsByClassName("main-section-wrapper");
const icon = document.getElementsByClassName("icon");
let noteSection = document.querySelector("#noteSection");
let icons = document.getElementsByClassName("side-nav-icon");
let arrayForStorage = [];   // Array med de objekt som går till local storage //
lastNavClick = [];      // Array med den ikon som klickats //
let hidingAndShowingQuill = document.getElementById("hidingAndShowingQuill");
let divInsideToolbar = document.getElementsByClassName("ql-toolbar"); //Div som Quill skapar tillsammans med editor element//
const toolbarOptions = [
        ['bold', 'italic', 'underline','strike'], 
        [{'header':1},{'header':2},{'header':false}],
        [{list:"ordered"},{list:"bullet"}],
        ['image','link'],
        [{color:[]},{background:[]}]
]

var quill = new Quill('#editor', {        //Quill//
    modules: {

        toolbar: toolbarOptions
    },
    theme: 'snow',
});


function randomNum() {                  // Skapar ID till objekt
    return Math.floor((Math.random() * 1000) + 1);
}
window.onload = (updateNoteSectionWithNotes());

function welcome(){
    let welcomeDiv = document.createElement("div");
    let welcomeH1 = document.createElement("h1");
    let welcomeP = document.createElement("p");
    welcomeP.textContent = "Take a note and unleash your creativity!"
    welcomeH1.textContent = "Welcome to QUIRE!";
    welcomeDiv.appendChild(welcomeH1)
    welcomeDiv.appendChild(welcomeP);
    welcomeDiv.classList.add("welcome")
    welcomeDiv.setAttribute("id","welcomeText");
    mainSectionWrapper[0].appendChild(welcomeDiv);

}
// Skapar klick event åt alla ikoner i nav section //
for (i = 0; i < icons.length; i++) {      //Loopar över ikoner//
    icons[i].addEventListener("click", addContentToNoteSection);
}
//Uppdaterar innehållet i note-section beroende på vilken ikon som klickats i nav-section.//
/*
    Lägger den klickade ikonens id som string i en array.
    Sista index i arrayen kontrolleras varje gång man klickan på en ikon
    Gör att notesection inte ska spammas med samma innehåll flera gånger 
*/
function addContentToNoteSection(e) {    //e är det ikon element som klickats.
    console.log(e.target.id)
    if (e.target.id === "settings" && lastNavClick[lastNavClick.length - 1] === "settings") {
        console.log("Settings visas redan")
    }
    else if (e.target.id === "settings" && lastNavClick[lastNavClick.length - 1] !== "settings") {     //SETTINGS//
        noteSection.innerHTML = "";
        let textFormatSetting = ["Font", "Background Color"];
        let divAmount = 2; //Ändra siffra när fler settings läggs till -- SKRIV OM TILL textFormatSetting.length -- //
        let i = 0;
        while (i < divAmount) { // FIXA TILL .length //
            i++;
            newDiv = document.createElement("div");
            let oneDiv = textFormatSetting.pop();
            newDiv.textContent = oneDiv;
            noteSection.appendChild(newDiv);
        }
    }
    else if (e.target.id === "seeNotes" && lastNavClick[lastNavClick.length - 1] !== "seeNotes") {     //NOTES//
        noteSection.innerHTML = "";
        updateNoteSectionWithNotes();
        let removeWelcome = document.getElementById("welcomeText")
        try{                                                              //Undviker att welcometext dyker upp när search knappen används
            removeWelcome.parentNode.removeChild(removeWelcome) 
        }
        catch(err){}
    }
    lastNavClick.push(e.target.id)
}

/* Hittar och lägger upp objekt från tidigare local storage till note-section, 
 Används i search ikon & window.onload */

function updateNoteSectionWithNotes() {
    let theStorage = JSON.parse(localStorage.getItem("TextAndTitle"));
    welcome()
    if (theStorage) {
        console.log(theStorage)
        for (i = 0; i < theStorage.length; i++) {
            let createDiv = document.createElement("div");
            let createTitle = document.createElement("h4");
            let createP = document.createElement("p");
            let iconOne = "icon fa fa-star";
            let iconTwo = "icon fa fa-pencil";
            let createIconStar = document.createElement("i");
            let createIconPencil = document.createElement("i");
            createIconStar.classList.add.apply(createIconStar.classList, iconOne.split(" "))
            createIconPencil.classList.add.apply(createIconPencil.classList, iconTwo.split(" "))
            createDiv.style.position = "relative";
            createIconPencil.classList.add("note-section-icon")
            createIconStar.classList.add("note-section-icon")
            createIconPencil.classList.add("note-section-pencil")
            createIconStar.classList.add("note-section-star")
            let windowObjFromStorage = theStorage[i];
            createTitle.textContent = windowObjFromStorage.title;
            createP.textContent = windowObjFromStorage.text;
            arrayForStorage.push(windowObjFromStorage)
            createDiv.appendChild(createTitle)
            createDiv.appendChild(createP)
            createDiv.appendChild(createIconPencil)
            createDiv.appendChild(createIconStar)
            createIconStar.classList.add("fav-icon-star");
            createDiv.classList.add("note-section-prev");
            noteSection.appendChild(createDiv);

        }
    }
    else if (theStorage == null) {
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
    let removeWelcome = document.getElementById("welcomeText")
    try{                                                              //Undviker typeerror när welcome är borttaget
        removeWelcome.parentNode.removeChild(removeWelcome) 
    }
    catch(err){}

    if (!hidingAndShowingQuill.querySelector("#inputTitle")) {        //Kontrollerar om det redan finns en titel i quill 
        hidingAndShowingQuill.insertAdjacentElement("afterbegin", noteInputElementTitle)
    }
    console.log("Clicked!");

    if (icon[0].name === "pencil") {
        icon[0].name = "save";
    } else {
        icon[0].name = "pencil"
        const inputTitle = document.getElementById("inputTitle");       // Sparar info från input(text och titel)
        const inputTitleValue = inputTitle.value;
        const inputTextValueHTML = quill.root.innerHTML;
        const inputTextValue = quill.root.textContent;
        console.log(inputTextValue)
        hidingAndShowingQuill.style.display = "none";    // Gömmer quill //
        quill.deleteText(0, quill.getLength()); //Raderar text i quill annars visas text från tidigare session//
        if (hidingAndShowingQuill.contains(noteInputElementTitle)) {
            hidingAndShowingQuill.removeChild(noteInputElementTitle) // Raderar titeln//
        }
        function createObject(title, text, texthtml, favourite, id) {                                      //Constructorfunktion >> skapar objekt att spara i localstorage //
            this.title = title;
            this.text = text;
            this.texthtml = texthtml;
            this.favourite = false;
            this.id = id;
            this.clickable = clickable;
        }
        function saveToStorage(title, text, texthtml, favourite, id) {
            let newObject = Object.create(createObject);                                    //Skapar nytt objekt//
            newObject.title = title;                                                        //Lägger in titel och namn//
            newObject.text = text;
            newObject.texthtml = texthtml;
            newObject.favourite = false;
            newObject.id = randomNum();
            newObject.clickable = function () {
                console.log(this);
            }
            arrayForStorage.push(newObject)
            console.log(arrayForStorage)                                                //Lägger in objektet i tom array och sparar array i localstorage //
            localStorage.setItem("TextAndTitle", JSON.stringify(arrayForStorage));
            let createDiv = document.createElement("div");
            // createDiv.classList.add("note-section-prev");
            let createTitle = document.createElement("h4");
            let createP = document.createElement("p");
            let createIconStar = document.createElement("i");
            let createIconPencil = document.createElement("i");
            let iconOne = "icon fa fa-star";
            let iconTwo = "icon fa fa-pencil";

            createTitle.textContent = (arrayForStorage[arrayForStorage.length - 1].title)
            createP.textContent = (arrayForStorage[arrayForStorage.length - 1].text)
            noteSection.appendChild(createDiv);
            createDiv.appendChild(createTitle)
            createDiv.appendChild(createP)
            noteSection.appendChild(createDiv)

            createIconStar.classList.add.apply(createIconStar.classList, iconOne.split(" "));
            createIconPencil.classList.add.apply(createIconPencil.classList, iconTwo.split(" "));
            createIconPencil.classList.add("note-section-icon");
            createIconStar.classList.add("note-section-icon");
            createIconPencil.classList.add("note-section-pencil");
            createIconStar.classList.add("note-section-star");                                   //Lägger det senast tilllagda objektet högst i note-section div// 
        }
        if (inputTitleValue && inputTextValue) {                    //Om text skrivits i inputfälten så skickas den till saveToStorage funktionen//
            saveToStorage(inputTitleValue, inputTextValue, inputTextValueHTML) // 1 Titel, 2 Text, 3 Text i html form, 4 favorit,        
        }
        else {
            console.log("empty input")
        };
        inputTitle.remove();

    }
})
noteSection.addEventListener("click", (e) => {
    // console.log(e.target.parentNode);
    if (e.target.parentNode.classList.contains("note-section")) {
        // console.log("the div");
        // console.log(e.target);
        const allNotesPreview = document.querySelectorAll(".note-section-prev")
        // console.log(allNotesPreview);
        allNotesPreview.forEach(el => el.classList.remove("active-note-list"))
        e.target.classList.add("active-note-list")
    }

    if (e.target.classList.contains("fav-icon-star")) {
        // console.log("star");
        // console.log(e.target.parentNode);
        e.target.classList.toggle("fav-icon-color")
    }
})
noteSection.addEventListener("click", (e) => {          //Settings//
    if(e.target.textContent == "Background Color"){     //BAKGRUNDSFÄRGER//
        noteSection.children[1].innerHTML = "Font";

        e.target.innerHTML= "<p class='settingsText'>Background Colors:</p><div class='btn-group'><button class='bg-btn'><p>Blue</p></button><button class='bg-btn'><p>Silver</p></button><button class='bg-btn'><p>Green</p></button></div>";
        e.target.style.display = "flex";
        e.target.style.flexWrap = "wrap";

        for(i=0;i < e.target.parentNode.children.length;i++){
            e.target.parentNode.children[i].style.backgroundColor = "#ebebeb"       //Nollställer färger för settings
        }
        e.target.style.backgroundColor = "#bcbcbc"

        let btnGroup = document.querySelectorAll(".bg-btn");
        for(i=0;i < btnGroup.length;i++){
            btnGroup[i].addEventListener("click",(el)=>{
                if(el.target.textContent == "Blue"){
                    theBody[0].style.backgroundColor = "rgba(0,83,255,0.13)";
                    theBody[0].style.zIndex = "-1";
                    noteSection.style.boxShadow = "8px 0px 3px 0px #005392, inset 8px 0px 3px 0px white";

                    inputTitle.style.backgroundColor = "rgb(51, 153, 255,0.1)";
                    inputTitle.style.border = "1px solid blue";
                }
                else if(el.target.textContent == "Silver"){
                    theBody[0].style.backgroundColor = "#E8E8E8";
                    theBody[0].style.zIndex = "-1";
                    noteSection.style.boxShadow = "8px 0px 3px 0px gray, inset 8px 0px 3px 0px white";
                    inputTitle.style.backgroundColor = "whitesmoke";
                    inputTitle.style.border = "1px solid gray"
                }
                else if(el.target.textContent == "Green"){
                    theBody[0].style.backgroundColor = "rgb(124,252,0,0.13)";
                    theBody[0].style.zIndex = "-1";
                    noteSection.style.boxShadow = "8px 0px 3px 0px green, inset 8px 0px 3px 0px white";
                    inputTitle.style.backgroundColor = "rgba(224, 255, 194)";
                    inputTitle.style.border = "1px solid green"
                }
            }
            )
        }
        }
        else if(e.target.textContent == "Font"){        //ÄNDRAR FONT 
            e.target.innerHTML= "<p class='settingsText'>Fonts:</p><div class='btn-group'><button class='bg-btn'><p>Arial Black</p></button><button class='bg-btn'><p>Roboto</p></button><button class='bg-btn'><p>Brush Script MT</p></button></div>";
            e.target.style.backgroundColor = "#bcbcbc"
            noteSection.children[0].innerHTML = "Background Color";
            noteSection.children[0].style.backgroundColor = "#ebebeb";
            let btnGroup = document.querySelectorAll(".bg-btn");
            for(i=0;i < btnGroup.length;i++){
                btnGroup[i].addEventListener("click",(el)=>{
                    if(el.target.textContent == "Arial Black"){
                        console.log(theBody[0])
                        theBody[0].style.fontFamily = "Arial black";
                        editor.setAttribute('style','font-family:Arial black' + '!important')

                    }
                    else if(el.target.textContent == "Roboto"){
                        theBody[0].style.fontFamily = "Roboto";
                        editor.setAttribute('style','font-family:Roboto' + '!important');
                    }
                    else if(el.target.textContent == "Brush Script MT"){
                        theBody[0].style.fontFamily = "Brush Script MT";
                        editor.setAttribute('style','font-family:Brush Script MT' + '!important');
                    }
        })}}

        // e.target.parentNode.children.forEach


})