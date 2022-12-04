const getBtn = document.querySelector(".getContent");
const noteSideBar = document.querySelector(".note-section");
const notesWrapper = document.querySelector(".notes-wrapper");
const quillEditorWrapper = document.querySelector(".editor-wrapper");
const welcomeScreen = document.querySelector(".welcome-screen");
const sideNav = document.querySelector(".side-nav");
const sideNavItems = document.querySelectorAll(".side-nav-item");
const titleInput = document.querySelector(".title-input");
const btnNew = document.querySelector(".btn-createNew")
 
var ColorClass = Quill.import('attributors/class/color');
Quill.register(ColorClass, true);
 
let prevNotes = JSON.parse(localStorage.getItem("notes"));
let editing = false;
let editingNote;
const toolbarOptions = [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{"color": []}, { 'background': [] }], ['link', 'image']];
const notePreviewHtmlAdd = (note) => {
    const html = `<div data-id='${note.id}' class='note-preview'>
                    <h4>${note.title}</h4>
                    <p>${note.subTitle}</p>
 
                    <button class="btn-addToFav"><i class="icon fa fa-star" aria-hidden="true"></i></button>
                    <button class='btn btn-editNote'><i class="icon fa fa-pencil" aria-hidden="true"></i></button>
                </div>`
    noteSideBar.insertAdjacentHTML("afterbegin", html)
 
}
 
const addNoteHtml = (note) => {
    const html = `<div data-id='${note.id}' class="note">
                        <h1>${note.title}</h1>
                        <span class='date-wrapper'>Last edited: ${note.edited}</span>
                        ${note.content}
 
                      </div>`
 
    notesWrapper.innerHTML = html;
}
 
if(!prevNotes) {
    prevNotes = [];
} else {
    prevNotes.forEach(notePreviewHtmlAdd)
}
 
const quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'
});
 
getBtn.addEventListener("click", (e) => {
    if(!titleInput.value) {
        alert("Please add a title");
        return;
    }
    const noteTitle = titleInput.value
    const noteContent = quill.root.querySelector("p")
    const noteSubTitle = noteContent ? `${noteContent.innerText.substring(0, 40)}...` : ""
    const date = new Date().toLocaleDateString()
    console.log(date)
    if(editing) {
        editing = false;
        noteSideBar = "";
        prevNotes.forEach(note => {
            if(note.id == editingNote.id) {
                note.title = noteTitle;
                note.content = quill.root.innerHTML;
                note.subTitle = noteSubTitle;
                note.edited = date;
                note.delta = quill.getContents();
                editingNote = note;
            }
            notePreviewHtmlAdd(note)
        })
 
        localStorage.setItem("notes", JSON.stringify(prevNotes));
        quill.root.innerHTML = titleInput.value = "";
 
        notesWrapper.style.display = "block";
        quillEditorWrapper.style.display = "none";
 
        addNoteHtml(editingNote);
        editingNote = undefined;
        return
    }
    const noteObj = {
        id: prevNotes.length,
        title: noteTitle,
        subTitle: noteSubTitle,
        edited: date,
        content: quill.root.innerHTML,
        delta: quill.getContents(),
        fav: false
    }
    prevNotes.push(noteObj);
    localStorage.setItem("notes", JSON.stringify(prevNotes));
    notePreviewHtmlAdd(noteObj);
})
 
noteSideBar.addEventListener("click", (e) => {
    const {target} = e
    console.log(target)
    if(target.classList.contains("note-preview")) {
        welcomeScreen.style.display = "none"
        const allNotesPreview = document.querySelectorAll(".note-preview")
 
        allNotesPreview.forEach(el => el.classList.remove("active"))
        target.classList.add("active")
        const id = target.dataset.id;
 
        const currNote = prevNotes.find(note => note.id == id)
 
        console.log(currNote)
        quillEditorWrapper.style.display = "none";
        notesWrapper.style.display = "block";
 
        addNoteHtml(currNote)
    }
 
    // if(target.classList.contains("btn-createNew")) {
    // }
 
    if(target.classList.contains("btn-addToFav")) {
        const id = target.parentElement.dataset.id;
        target.classList.toggle("active")
        console.log("henlo")
        prevNotes.forEach(note => {
            if(note.id == id) {
                console.log("henlo")
                note.fav = !note.fav
            }
        })
        localStorage.setItem("notes", JSON.stringify(prevNotes))
    }
    if(target.classList.contains("btn-editNote")) {
        editing = true;
        const id = target.parentElement.dataset.id
 
        editingNote = prevNotes.find(note => note.id == id)
 
        titleInput.value = editingNote.title
        quillEditorWrapper.style.display = "block";
        welcomeScreen.style.display = notesWrapper.style.display = "none";
        quill.setContents(editingNote.delta);
 
    }
})
 
notesWrapper.addEventListener("click", function(e) {
 
})
 
sideNav.addEventListener("click", function(e) {
    const {target} = e
    if(target.classList.contains("favourites")) {
        welcomeScreen.style.display = notesWrapper.style.display = quillEditorWrapper.style.display = "none";
        noteSideBar.innerHTML = ""
        prevNotes.forEach(note => {
            if(note.fav) {
                notePreviewHtmlAdd(note)
            }
        })
    }
    if(target.classList.contains("Q")) {
        noteSideBar.innerHTML = "";
        prevNotes.forEach(notePreviewHtmlAdd)
        welcomeScreen.style.display = "block"
        notesWrapper.style.display = quillEditorWrapper.style.display = "none";
    }
 
    if(target.classList.contains("side-nav-item")) {
        sideNavItems.forEach(item => item.classList.remove("active"))
        target.classList.add("active")
    }
})
 
 
btnNew.addEventListener("click", function(e) {
    welcomeScreen.style.display = notesWrapper.style.display = "none";
    quillEditorWrapper.style.display = "block";
})