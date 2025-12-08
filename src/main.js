//Book Class: represent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBook();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#table-body');

    const row = document.createElement('tr');
    row.className = 'text-center h-[35px]';

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td> <a href="#" class="px-5 bg-red-500 text-white text-center cursor-pointer delete"> X </a> </td>
    `;

    list.appendChild(row);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  static removeBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, bgColor, textColor) {
    const divAlert = document.createElement('div');
    const form = document.querySelector('#entry-container');
    divAlert.className = `w-full px-5 py-3 mt-3 rounded-sm ${bgColor} ${textColor}`;
    const msg = document.createTextNode(message);
    divAlert.appendChild(msg);
    document.body.insertBefore(divAlert, form);
    setTimeout(() => {
      divAlert.remove();
    }, 3000)
  }
}

//Store Class: Handles Storage
class Store {
  static getBook() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBook();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBook();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    })

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book
document.querySelector('#entry-container').addEventListener('submit', (e) => {
  //Prevent Default
  e.preventDefault();

  //Get values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //Instantiate Book
  const book = new Book(title, author, isbn);

  //Validate
  if (title === '', author === '', isbn === '') {
    UI.showAlert("please fill out the form and then press", "bg-red-500", "text-white");
  }

  //Add Book To UI
  UI.addBookToList(book);

  //Add Book to Storage
  Store.addBook(book);

  //Show Alert
  UI.showAlert("Book Added", "bg-green-500", "text-black");

  //Clear Feilds
  UI.clearFields();
})

//Event: Remove a book
document.querySelector('#table-body').addEventListener('click', (e) => {
  //Remove book from UI
  UI.removeBook(e.target);

  //Remove From Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show Alert
  UI.showAlert("Book Removed", "bg-red-500", "text-white");
})