const tableBody = document.querySelector(".table-container tbody");
const addBookForm = document.querySelector("#add-book-form");
const btnAddBook = document.querySelector(".btn-add-book");
const dashboardFormTitle = document.querySelector(".dashboard-form-title");
const currentUserDOM = document.querySelector(".current-user");
const toasterMessageContainer = document.querySelector(
  ".toaster-message-container"
);
const navPP = document.querySelector(".nav-pp");
const resetForm = () => {
  addBookForm.title.value = "";
  addBookForm.author.value = "";
  addBookForm.publisher.value = "";
  addBookForm.ISBN.value = "";
  addBookForm.category.value = "";
  btnAddBook.innerText = "Add";
  dashboardFormTitle.innerText = "Add new book";
};

const showToasterMessage = (type, message) => {
  toasterMessageContainer.innerText = message;
  if (type === "success") {
    toasterMessageContainer.classList.add("show", "success");
  } else {
    toasterMessageContainer.classList.add("show", "fail");
  }
};

const hideToasterMessage = () => {
  toasterMessageContainer.classList.remove("show");
};

const addBook = async ({ title, author, publisher, ISBN, category }) => {
  try {
    const option = btnAddBook.innerText.toLowerCase();
    let method = "POST";
    let url = "/api/v1/books";
    let successMsg = "Successfully added!";
    if (option === "edit") {
      const id = btnAddBook.dataset.id;
      method = "PATCH";
      url = `${url}/${id}`;
      successMsg = "Successfully edited!";
    }
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        author,
        publisher,
        ISBN,
        category,
      }),
    });
    const { status, message } = await response.json();
    if (status === "success") {
      showToasterMessage("success", successMsg);
      resetForm();
    } else {
      showToasterMessage("fail", message);
    }

    setTimeout(() => {
      hideToasterMessage();
    }, 2000);
    start();
  } catch (err) {
    const errMsg = err.response.data.message;
    showToasterMessage("fail", errMsg);
    setTimeout(() => {
      hideToasterMessage();
    }, 2000);
  }
};

addBookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = this.title.value;
  const author = this.author.value;
  const publisher = this.publisher.value;
  const ISBN = this.ISBN.value;
  const category = this.category.value;
  addBook({ title, author, publisher, ISBN, category });
});

const start = async () => {
  const response = await fetch("/api/v1/books");
  const { data } = await response.json();
  const books = data
    .map((book) => {
      const { _id, title, author, publisher, ISBN, category } = book;
      return `<tr>
              <td>${title}</td>
              <td>${author}</td>
              <td>${publisher}</td>
              <td>${ISBN}</td>
              <td>${category}</td>
              <td>
                <span class="btn-table-action btn-delete-book" data-id="${_id}" >Delete</span>
                <span class="btn-table-action btn-edit-book" data-id="${_id}">Edit</span>
              </td>
            </tr>`;
    })
    .join(" ");
  tableBody.innerHTML = books;
};

// edit and delete book
tableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete-book")) {
    const id = e.target.dataset.id;
    const response = await fetch(`/api/v1/books/${id}`, {
      method: "DELETE",
    });
    const { status, message } = await response.json();
    if (status === "success") {
      showToasterMessage("success", "Successfully deleted!");
    } else {
      showToasterMessage("fail", message);
    }
    setTimeout(() => {
      hideToasterMessage();
    }, 2000);
    start();
  } else if (e.target.classList.contains("btn-edit-book")) {
    const id = e.target.dataset.id;
    const response = await fetch(`/api/v1/books/${id}`);
    const {
      data: { title, author, publisher, ISBN, category },
    } = await response.json();
    addBookForm.title.value = title;
    addBookForm.author.value = author;
    addBookForm.publisher.value = publisher;
    addBookForm.ISBN.value = ISBN;
    addBookForm.category.value = category;
    dashboardFormTitle.innerText = "Edit existing book";
    btnAddBook.innerText = "Edit";
    btnAddBook.dataset.id = id;
  }
});

const setCurrentUser = async () => {
  const response = await fetch("/currentUser");
  const {
    data: { username, userId },
  } = await response.json();
  currentUserDOM.innerText = username;
  const newResponse = await fetch(`/api/v1/users/${userId}`);
  const {
    data: { photo },
  } = await newResponse.json();

  if (photo) {
    navPP.src = `${photo}`;
    // navPP.src = `images/users/${photo}`;
  } else {
    navPP.src =
      "https://res.cloudinary.com/nepal-cloud/image/upload/v1633943273/default.png";
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  await setCurrentUser();
  await start();
});

// file upload
// const fileForm = document.querySelector("#file-form");

// fileForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const formData = new FormData();
//   formData.append("avatar", fileForm.avatar.files[0]);
//   await fetch("/upload", {
//     method: "POST",
//     body: formData,
//   });
// });
