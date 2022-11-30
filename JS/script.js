const noteBtn = document.getElementsByClassName("note-btn");
// const activeList = document.querySelectorAll('.active-note-list');
const noteSection = document.getElementsByClassName("note-section");
const mainSection = document.getElementsByClassName("main-section");
const icon = document.getElementsByClassName("icon");

noteBtn[0].addEventListener("click", () => {
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
        console.log(inputTitle.value);
        console.log(input.value);
        // var header = document.createElement("h3");
        // var text = document.createElement("p");
        // header = inputTitle.value;
        // text = input.value;
        // mainSection[0].appendChild(header)
        // mainSection[0].appendChild(text)
        inputTitle.remove();
        input.remove();
    }
})

noteSection[0].addEventListener("click", (e) => {
    const parent = e.currentTarget.parentNode;
    console.log(e.target.parentNode.id);
    let test = e.target.parentNode;
    console.log(test, test.parentNode.querySelectorAll(".active-note-list"));
    if (e.target.parentNode.id === "the-note") {
        // e.target.parentNode.classList.toggle("active-note-list")

        // activeList.forEach(list => {
        //     list.classList.remove('active-note-list');
        // });
        // test.parentNode.querySelectorAll("div").classList.remove()
        e.target.parentNode.classList.toggle("active-note-list")
    } else {
        e.target.parentNode.classList.remove("active-note-list")
        console.log("failed bruh");
    }
    // console.log(parent);
    // if (e.target.id === "the-note") {
    //     console.log(e.target);
    // } else {
    //     const parent = e.currentTarget.parentNode;
    //     console.log(parent);
    //     console.log(e.target);
    // }
})

console.log("hey!");