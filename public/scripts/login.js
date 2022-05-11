import {getElement, fetchData, getUserIntoStore, getTokenIntoStore} from "./main.js";

const form = getElement(document, "#login_form")
const errorContainer = getElement(document, ".form-error")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = {
        user_email : form["user_email"].value,
        user_password : form["user_password"].value
    }
    await fetchData('/user/login', data, "POST").then((res) => {
        getUserIntoStore(res.user);
        getTokenIntoStore(res.token)
        window.location.href = "/"
    }).catch((err) =>
    {
        errorContainer.textContent = err.error
        setTimeout(() => {
            errorContainer.textContent = ""
        }, 2000)
    })
})