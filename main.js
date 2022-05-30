const books = [];
const RENDER_EVENT = "render-book";

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }
    return -1
}

function makeBook(bookObject) {

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis: " + bookObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: " + bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(bookTitle, textAuthor, textYear);

    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isComplete) {

        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.innerText = "Belum selesai dibaca";
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {

        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.innerText = "Selesai dibaca";
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        container.append(checkButton, trashButton);
    }

    return container;
}

function addBook() {
    const BookTitle = document.getElementById("inputBookTitle").value;
    const BookAuthor = document.getElementById("inputBookAuthor").value;
    const BookYear = document.getElementById("inputBookYear").value;
    const BookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, BookTitle, BookAuthor, BookYear, BookIsComplete);
    books.push(bookObject);
    console.log(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const isDelete = window.confirm("Apakah anda yakin ingin menghapus buku ini?");
    if (isDelete) {
        const bookTarget = findBookIndex(bookId);
        books.splice(bookTarget, 1);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        alert("Buku berhasil dihapus!");
    } else {
        alert("Buku batal dihapus!");
    }
}

function undoTaskFromCompleted(bookId) {

    const bookTarget = findBook(bookId);
    console.log(bookTarget);
    if (bookTarget == null) return;
    console.log(bookTarget);

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function checkButton() {
    const span = document.querySelector("span");
    if (inputBookIsComplete.checked) {
        span.innerText = "Selesai dibaca";
    } else {
        span.innerText = "Belum selesai dibaca";
    }
}

function searchBook() {
    const searchBook = document.getElementById("searchBookTitle");
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .book_item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("inputBook");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const inputSearchBook = document.getElementById("searchBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    inputBookIsComplete.addEventListener("input", function (event) {
        event.preventDefault();
        checkButton();
    });

    inputSearchBook.addEventListener("keyup", function (event) {
        event.preventDefault();
        searchBook();
    });

    inputSearchBook.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});


document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
    const listCompleted = document.getElementById("completeBookshelfList");

    uncompletedBOOKList.innerHTML = ""
    listCompleted.innerHTML = ""

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBOOKList.append(bookElement);
        }
    }
})

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";


function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (book of data) {
            books.push(book);
        }
    }


    document.dispatchEvent(new Event(RENDER_EVENT));
}