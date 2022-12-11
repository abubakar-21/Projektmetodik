// Selecting elements
const saveBtn = document.querySelector(".getContent");
const noteSideBar = document.querySelector(".note-section");
const notesWrapper = document.querySelector(".notes-wrapper");
const quillEditorWrapper = document.querySelector(".editor-wrapper");
const welcomeScreen = document.querySelector(".welcome-screen");
const sideNav = document.querySelector(".side-nav");
const sideNavItems = document.querySelectorAll(".side-nav-item");
const titleInput = document.querySelector(".title-input");
const btnNew = document.querySelector(".btn-createNew");
const settingsPage = document.querySelector(".settings-page");
const fontDropDown = document.querySelector(".font-dropd");

// settng text color for quill
var ColorClass = Quill.import("attributors/class/color");
Quill.register(ColorClass, true);

// getting previous notes
let prevNotes = JSON.parse(localStorage.getItem("notes"));

// editing variables
let editing = false;
let editingNote;

// toolbar options for quill
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  ["link", "image"],
];

// func for getting html of note preview (side bar)
const getNotePreviewHtml = (note) => {
  return `<div data-id='${note.id}' class='note-preview'>
            <h4>${note.title}</h4>
            <p>${note.subTitle}</p>
 
            <button class="btn-addToFav ${
              note.fav ? "active" : ""
            }"><i class="icon fa fa-star" aria-hidden="true"></i></button>
            <button class='btn btn-editNote'><i class="icon fa fa-pencil" aria-hidden="true"></i></button>
        </div>`;
};

// func for adding note preview html to the note side bar
const notePreviewHtmlAdd = (note) => {
  const html = getNotePreviewHtml(note);
  noteSideBar.insertAdjacentHTML("afterbegin", html);
};

// func for adding note to html
const addNoteHtml = (note) => {
  const html = `<div data-id='${note.id}' class="note">
                        <h1>${note.title}</h1>
                        <span class='date-wrapper'>Last edited: ${note.edited}</span>
                        ${note.content}
 
                      </div>`;

  notesWrapper.innerHTML = html;
};

// if prevnotes exists then add those in note sidebar
if (!prevNotes) {
  prevNotes = [];
} else {
  prevNotes.forEach(notePreviewHtmlAdd);
}

// initializing quill
const quill = new Quill("#editor", {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: "snow",
});

// click event for save button
saveBtn.addEventListener("click", (e) => {
  // if title is empty then alert and return
  if (!titleInput.value) {
    alert("Please add a title");
    return;
  }

  // getting values from input fields and quill editor
  const noteTitle = titleInput.value;
  const noteContent = quill.root.querySelector("p");
  const noteSubTitle = noteContent
    ? `${noteContent.innerText.substring(0, 40)}...`
    : ""; // taking quill editors text and then taking 40characters from there and then using literal string, adding three dots at the end.
  const date = new Date().toLocaleDateString();

  // if a note is being edited
  if (editing) {
    // set editing to false after clicking save
    editing = false;
    // clearing note side bar for updating it
    noteSideBar.innerHTML = "";
    // updating edited note obj and adding it to sidebar
    prevNotes.forEach((note) => {
      if (note.id == editingNote.id) {
        note.title = noteTitle;
        note.content = quill.root.innerHTML;
        note.subTitle = noteSubTitle;
        note.edited = date;
        note.delta = quill.getContents();
        editingNote = note;
      }
      notePreviewHtmlAdd(note);
    });

    // updating note data on local storage
    localStorage.setItem("notes", JSON.stringify(prevNotes));
    // clearing inputs
    quill.root.innerHTML = titleInput.value = "";

    //showing note container and hiding quill editor
    notesWrapper.style.display = "block";
    quillEditorWrapper.style.display = "none";

    // adding note to html and removing editing note
    addNoteHtml(editingNote);
    editingNote = undefined;
    return;
  }
  // if not editing then create a new note obj
  const noteObj = {
    id: prevNotes.length,
    title: noteTitle,
    subTitle: noteSubTitle,
    edited: date,
    content: quill.root.innerHTML,
    delta: quill.getContents(),
    fav: false,
  };
  // adding the new note obj to note obj array
  prevNotes.push(noteObj);
  // updating the local storage
  localStorage.setItem("notes", JSON.stringify(prevNotes));
  // adding the new note's preview in side bar
  notePreviewHtmlAdd(noteObj);
});

// click event for note side bar
noteSideBar.addEventListener("click", (e) => {
  // getting target from event obj
  const { target } = e;
  // if target is a note preview
  if (target.classList.contains("note-preview")) {
    // hiding welcome screen
    welcomeScreen.style.display = "none";
    // getting all note preview
    const allNotesPreview = document.querySelectorAll(".note-preview");

    // removing active class from all note preview
    allNotesPreview.forEach((el) => el.classList.remove("active"));
    // adding active class to the target
    target.classList.add("active");
    // gettin id from target
    const id = target.dataset.id;

    // finding the current note
    const currNote = prevNotes.find((note) => note.id == id);

    // hiding quill editor and settings page
    quillEditorWrapper.style.display = settingsPage.style.display = "none";

    // showing note wrapper
    notesWrapper.style.display = "block";

    // adding note to html
    addNoteHtml(currNote);
  }

  // if target is add to fav button
  if (target.classList.contains("btn-addToFav")) {
    // getting the id
    const id = target.parentElement.dataset.id;

    // toggling active class
    target.classList.toggle("active");
    // updating note favourite status
    prevNotes.forEach((note) => {
      if (note.id == id) {
        note.fav = !note.fav;
      }
    });
    // updating local storage
    localStorage.setItem("notes", JSON.stringify(prevNotes));
  }

  // if target is note editing button
  if (target.classList.contains("btn-editNote")) {
    // setting editing variable to true (used while saving)
    editing = true;
    // getting id
    const id = target.parentElement.dataset.id;

    // finding the note which is being edited
    editingNote = prevNotes.find((note) => note.id == id);

    //showing and hiding element and setting the input fields to the notes content
    titleInput.value = editingNote.title;
    quillEditorWrapper.style.display = "block";
    welcomeScreen.style.display =
      notesWrapper.style.display =
      settingsPage.style.display =
        "none";
    quill.setContents(editingNote.delta);
  }
});

// click event for side nav
sideNav.addEventListener("click", function (e) {
  // getting target from the event obj
  const { target } = e;

  // if target is favourites button
  if (target.classList.contains("favourites")) {
    // hiding elements
    welcomeScreen.style.display =
      notesWrapper.style.display =
      quillEditorWrapper.style.display =
      settingsPage.style.display =
        "none";
    // clearing note side bar
    noteSideBar.innerHTML = "";
    // adding favourite notes to note side bar
    prevNotes.forEach((note) => {
      if (note.fav) {
        notePreviewHtmlAdd(note);
      }
    });
  }

  // if target is search button
  if (target.classList.contains("search")) {
    // hiding elements
    welcomeScreen.style.display =
      notesWrapper.style.display =
      quillEditorWrapper.style.display =
        "none";

    // adding the input field for searching on note side bar
    noteSideBar.innerHTML =
      "<input name='search-input' class='search-input' id='search-input' placeholder='Enter Search Keywords'/>";

    // gettint that input element
    const searchInput = document.querySelector(".search-input");
    // adding keypress event listener for that search field
    searchInput.addEventListener("keypress", function (e) {
      // getting target value and key from event obj
      const {
        target: { value },
        key,
      } = e;

      // if key pressed is Enter
      if (key == "Enter") {
        // if there is no value then alert and return
        if (!value) {
          alert("Please type something");
          return;
        }
        // removing all note preview and keeping the input field
        while (noteSideBar.childNodes.length > 1) {
          noteSideBar.removeChild(noteSideBar.lastChild);
        }

        // if note starts with inputed value then add to note side bar
        prevNotes.forEach((note) => {
          if (note.title.toLowerCase().startsWith(value.toLowerCase())) {
            const html = getNotePreviewHtml(note);
            searchInput.insertAdjacentHTML("afterend", html);
          }
        });
        // if no note previews are added then alert
        if (noteSideBar.childNodes.length <= 1) {
          alert("Couldn't find any");
        }
      }
    });
  }

  // if target is home button
  if (target.classList.contains("Q")) {
    // clearing note side bar
    noteSideBar.innerHTML = "";
    // adding to note side bar a new
    prevNotes.forEach(notePreviewHtmlAdd);
    // showing screen
    welcomeScreen.style.display = "block";
    // hiding elements
    notesWrapper.style.display =
      quillEditorWrapper.style.display =
      settingsPage.style.display =
        "none";
  }

  // if target contains side nav item class
  if (target.classList.contains("side-nav-item")) {
    // removing active class from side nav items
    sideNavItems.forEach((item) => item.classList.remove("active"));
    // adding active class to target
    target.classList.add("active");
  }

  // if the target is settings button
  if (target.classList.contains("settings")) {
    // showing settings page
    settingsPage.style.display = "block";
    // hiding other main elements
    welcomeScreen.style.display =
      notesWrapper.style.display =
      quillEditorWrapper.style.display =
        "none";
    // clearing note side bar
    noteSideBar.innerHTML = "";

    // adding note previews again
    prevNotes.forEach(notePreviewHtmlAdd);
  }
});

// btn for creating new note click event listener
btnNew.addEventListener("click", function (e) {
  // hiding screens
  welcomeScreen.style.display =
    notesWrapper.style.display =
    settingsPage.style.display =
      "none";
  // showing quill editor
  quillEditorWrapper.style.display = "block";
});

// drop down change event listener
fontDropDown.addEventListener("change", function (e) {
  // gettin value from event obj
  const {
    target: { value },
  } = e;

  // removing classes from body
  document.body.removeAttribute("class");
  // adding font class to body
  document.body.classList.add(value);
});
