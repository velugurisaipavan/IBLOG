import {fetchData, getElement, isActiveUser} from "./main.js";

const form = getElement(document, "#create_post_form");
const errorContainer = getElement(document, "#post_error")
form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData();
    await fetchData("/category/createCategory", {category_name: form["category_name"].value}, "POST").then(async (res) => {
            let category_id;
            if (res.found) {
                category_id = res.error[0]["category_id"]
            } else {
                category_id = res.data["category_id"]
            }
            formData.append("title", form["title"].value)
            formData.append("content", form["content"].value)
            formData.append("photo", form["photo"].files[0])
            formData.append("category_id", category_id)
            await fetch("/post/createPost", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${isActiveUser()}`,
                },
                body: formData
            }).then((res) => {
                if (res.ok) {
                    window.location.href = "/"
                }
            }).catch((err) => {
                if (err) {
                    errorContainer.textContent = err.error
                    setTimeout(() => {
                        errorContainer.textContent = ""
                    }, 2000)
                }
            })
        }
    ).catch((err) => {
        errorContainer.textContent = err.message
        setTimeout(() => {
            errorContainer.textContent = " "
        }, 2000)
    })


})

const postList = getElement(document, "#post_list")
const chosen_post_list = getElement(document, "#chosen_post_list")
const postListGroup = getElement(document, "#post_list_group")
await fetch("/post/getAllPosts", {
    method: "GET",
    headers: {
        Accept: "application/json"
    }
}).then((res) => {
    if (res.ok) return res.json()
}).then((data) => {
    data.sort((postA, postB) => {
        const titleA = postA.title.toLowerCase()
        const titleB = postB.title.toLowerCase()
        if (titleA > titleB) {
            return -1
        }
        if (titleA < titleB) {
            return 1
        }
        return 0
    })?.forEach((data) => {
        chosen_post_list.innerHTML += `
                            <a href="/onepost/${data.post_id}" class="col-sm-12 col-md-4">
                        <div class="chosen-post">
                            <div class="chosen-post-img-wrapper">
                                <img src="${data.photo}" class="iblog-img" alt="${data.title}">
                            </div>
                            <div class="chosen-post-content">
                                <div class="category-label">${data.post_category_name}</div>
                                <div class="content-text">
                                    <small>08.09.2021</small>
                                    <h3 class="content-title my-1">${data.title}</h3>
                                    <p class="content-paragraph">
                                        ${data.content.slice(1, 255)}...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
        `
    })
    data?.forEach((post) => {
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

}).catch((err) => {
    console.log(err)
})

//* GET ONE POST BY ID

const post_id = window.location.pathname.split('/')[2];
const onepost_parent = getElement(document, "#one_post_parent");
await fetch(`/post/getPost/${post_id}`, {
    method: "GET"
}).then((res) => {
    if (res.ok) return res.json()
}).then((data) => {
    onepost_parent.innerHTML = `
        <h3 class="iblog-post-heading">
                ${data.title}</h3>
            <span class="badge bg-light text-dark fs-6 my-3">${data.post_category_name}</span>
            <div class="iblog-post-img-wrapper">
                <img src="${data.photo}" class="iblog-img" alt="${data.title}">
            </div>
            <p class="iblog-post-paragraph mt-3">
                ${data.content}
            </p>
    `
}).catch((err) => {
    console.log(err)
})