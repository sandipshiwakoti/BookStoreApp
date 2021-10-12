// ----------------------------------------------------------------
// Register Form
// ----------------------------------------------------------------

const registerForm = document.querySelector("#register-form");
const registerMessage = document.querySelector("#register-message");
const toasterMessageContainer = document.querySelector(
  ".toaster-message-container"
);

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

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = this.username.value;
  const email = this.email.value;
  const password = this.password.value;
  try {
    // const { data } = await axios.post("/api/v1/auth/register", {
    //   username,
    //   email,
    //   password,
    // });
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const { status, message } = await response.json();
    if (status === "success") {
      showToasterMessage("success", "Successfully registered!");
    } else if (status === "fail") {
      showToasterMessage("success", message);
    }
    setTimeout(() => {
      hideToasterMessage();
      if (status === "success") {
        window.location.href = "/index.html";
      }
    }, 2000);
  } catch (err) {
    const errMsg = err.response.data.message;
    showToasterMessage("fail", errMsg);
    setTimeout(() => {
      hideToasterMessage();
    }, 2000);
  }
});
