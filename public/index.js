// ----------------------------------------------------------------
// Login Form
// ----------------------------------------------------------------
const loginForm = document.querySelector("#login-form");
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

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = this.email.value;
  const password = this.password.value;
  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const { status, message } = await response.json();
    if (status === "success") {
      showToasterMessage("success", "Successfully logged in!");
    } else if (status === "fail") {
      showToasterMessage("success", message);
    }
    setTimeout(() => {
      hideToasterMessage();
      if (status === "success") {
        window.location.href = "/dashboard.html";
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
