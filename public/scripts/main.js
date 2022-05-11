
//* UTILITY FUNCTIONS
export const getElement = (parent, target) => {
    if (parent) return parent.querySelector(target)
    console.log(`Not found following target: ${target}`)
}

export const getAllElement = (parent, target) => {
    if (parent) return parent.querySelectorAll(target)
    console.log(`Not found following target: ${target}`)
}

//* FETCH DATA FUNCTION
export const fetchData = async (route = "", data = {}, methodType, headers = {}) => {
    const response = await fetch(`${route}`, {
        method: methodType, headers: {
            Accept: "application/json", "Content-Type": "application/json", ...headers
        }, body: data instanceof FormData ? data : JSON.stringify(data), mode: 'cors', credentials: 'same-origin'
    })

    if (response.ok) {
        return await response.json()
    }
    throw await response.json()
}

//* STORE USER INTO LOCALSTORAGE
export const getUserIntoStore = (user) => {
    if (user) return localStorage.setItem('user', JSON.stringify(user))
    console.log("Not found, got:", user)
}

export const getUserFromStore = () => {
    return JSON.parse(localStorage.getItem("user"))
}

export const getTokenIntoStore = token => {
    if (token) return localStorage.setItem("token", JSON.stringify(token))
    console.log("Not found, got:", token)
}

export const isActiveUser = () => {
    return JSON.parse(localStorage.getItem("token"))
}

if (getUserFromStore() && isActiveUser()) {
    const welcomeContainer = getElement(document, "#iblog_navbar_btns")
    welcomeContainer.innerHTML = `
        <span class="text-light">Welcome, ${getUserFromStore().first_name} ${getUserFromStore().last_name}</span>
        <button id="logout_btn" class="text-light btn btn-outline-danger">Log Out</button>
    `
    welcomeContainer.style.width = "35%";

    //* RENDER SOME FUNCTIONALITY WHEN USER LOGGED IN
    const navbar = getElement(document, "#navbar_nav")
    navbar.innerHTML = `
                    <li class="nav-item">
                        <a class="nav-link" href="/" aria-current="page" href="#">Home</a>
                     </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/dashboard">My activities</a>
                    </li>
                    <li class="nav-item">
                        <span id="create_post_btn" data-bs-toggle="modal" data-bs-target="#create_post_modal" class="nav-link pointer">Create post</span>
                    </li>
    `
    //* LOGOUT FUNCTION
    const logoutBtn = getElement(document, "#logout_btn")
    logoutBtn.addEventListener("click", (e) => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/"
    })
}

const categoryTabs = getElement(document, "#category_tabs")

await fetch("/category/getAllCategory", {
    method: 'GET'
}).then((res) => res.json()).then((categories) => {
    categories?.forEach((category) => {
        categoryTabs.innerHTML += `
            <li  class="nav-item">
                    <a accesskey="${category.category_id}" class="nav-link active pe-auto" aria-current="page" >${category.category_name}</a>
            </li>
        `
    })
}).catch((err) => console.log(err))
const categoryItems = getAllElement(categoryTabs, ".nav-item")
const postList = getElement(document, "#post_list")

categoryItems?.forEach((item) => {

    item.addEventListener("click", async (e) => {
        const category_id = e.target.accessKey
        if(category_id == "all") {
            window.location.href = "/"
        }
        postList.innerHTML = ""
        await fetch(`/post/getCategoryPost/${category_id}`, {
            method: 'GET'
        }).then((res) => res.json()).then((posts) => {
            posts?.forEach((post) => {
                postList.innerHTML += `
                <div class="col-sm-12 col-md-6 col-lg-3">
                        <a href="/onepost/${post.post_id}" class="card">
                            <div class="card-img-top">
                                <img src="${post.photo}" class="iblog-img" alt="${post.title}">
                            </div>
                            <div class="category-label">${post.post_category_name}</div>
                            <div class="card-body">
                                <small class="card-date">08.08.2021</small>
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text">${post.content.slice(1, 255)}...</p>
                            </div>
                        </a>
                </div>
            `
            })

        }).catch((err) => console.log(err))
    })
})