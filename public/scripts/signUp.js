import {fetchData, getElement} from "./main.js";

const form = getElement(document, "#signup_form"),
    errorContainer = getElement(document, ".form-error")
form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = {
        first_name: form["first_name"].value,
        last_name: form["last_name"].value,
        user_email: form["user_email"].value,
        user_password: form["user_password"].value
    }

    await fetchData('/user/register', data, "POST").then((res) => {
        if(res) return window.location.href = "/login"
    }).catch((err) => {
        if (err) errorContainer.append(err.error)
        setTimeout(() => {
            errorContainer.textContent = ""
        }, 2000)
    } )
})