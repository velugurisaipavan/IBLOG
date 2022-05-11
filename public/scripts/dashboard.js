import {fetchData, getElement, getUserFromStore, getUserIntoStore, isActiveUser} from "./main.js";

const accountInfo = getElement(document, "#account_info")
const postListGroup = getElement(document, "#post_list_group")
const formEdit = getElement(document, "#personal_info_edit_form")
const deleteUserBtn = getElement(document, "#delete_user_btn")

formEdit["first_name"].value = getUserFromStore().first_name
formEdit["last_name"].value = getUserFromStore().last_name
formEdit["user_email"].value = getUserFromStore().user_email

formEdit.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = {
        first_name: formEdit["first_name"].value,
        last_name: formEdit["last_name"].value,
        user_email: formEdit["user_email"].value
    }

    await fetchData(`/user/editUser/${getUserFromStore().user_id}`, data, "PUT", {
        Authorization: `Bearer ${isActiveUser()}`
    }).then((res) => {
        getUserIntoStore(res.user)
        window.location.href = "/dashboard"
    }).catch((err) => {
        console.log(err)
    })
})

deleteUserBtn.addEventListener("click", async (e) => {
    e.stopPropagation()
    await fetch(`/user/deleteUser/${getUserFromStore().user_id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${isActiveUser()}`
        }
    }).then((res) => {
        if (res.ok) return res.json()
    }).then((data) => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        window.location.href = "/"
    }).catch((err) => {
        console.log(err)
    })
})


await fetch("/post/getMyPosts", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${isActiveUser()}`
    }
}).then((res) => {
    if (res.ok) return res.json()
}).then((data) => {
    if(data.length > 0) {
        data?.forEach((post) => {
            postListGroup.innerHTML += `
             <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                    <img src="${post.photo}" alt="${post.title}" class=" dashboard-post-img rounded-circle flex-shrink-0">
                    <div class="d-flex gap-2 w-100 justify-content-between">
                        <div>
                            <h6 class="mb-0 fw-bold">${post.title}</h6>
                            <p class="mb-0 opacity-75">${post.content.slice(0, 250)}...</p>
                        </div>
                        <div class="text-nowrap d-flex align-items-center gap-2">
                            <button id="post_edit_btn" post="${post.post_id}" data-bs-toggle="modal" data-bs-target="#edit_post_modal" class="btn btn-success">Edit</button>
                            <button id="post_delete_btn" post_id="${post.post_id}"  class="btn btn-danger">Delete</button>
                        </div>
                    </div>
             </a>
        `
        })
    }
}).catch((err) => {
    if (!err.found) {
        postListGroup.innerHTML = `
            <div class="d-flex align-items-center gap-3 justify-content-center h-50">
            <span class="text-info">You do not have any post </span>
            <button data-bs-toggle="modal" data-bs-target="#create_post_modal" class="btn btn-sm btn-success">Create One</button>
            </div>
        `
    }
})

const editPostBtn = getElement(document, "#post_edit_btn")
const deletePostBtn = getElement(document, "#post_delete_btn")
const editForm = getElement(document, "#edit_post_form")
editPostBtn.addEventListener("click", async (e) => {
    e.stopPropagation()
    const post_id = e.target.attributes[1].value
    await fetch(`/post/getPost/${post_id}`, {
        method: "GET"
    }).then((res) => res.json()).then((data) => {
        editForm["post_id"].value = data.post_id
        editForm["title"].value = data.title
        editForm["content"].value = data.content
        editForm["category_name"].value = data.post_category_name
        editForm["photo"].filename = data.photo
    }).catch((err) => console.log(err))
})

editForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData()
    const post_id = editForm["post_id"].value
    formData.append("title", editForm["title"].value)
    formData.append("content", editForm["content"].value)
    formData.append("photo", editForm["photo"].files[0])

    await fetch(`/post/editPost/${post_id}`, {
        method: 'PUT',
        body: formData,
        headers: {
            Authorization: `Bearer ${isActiveUser()}`
        }
    }).then((res) => res.json()).then((data) => {
        window.location.href = '/dashboard'
    }).catch((err) => {
        console.log(err)
    })
})

deletePostBtn.addEventListener("click", async (e) => {
    e.stopPropagation()
    const post_id = e.target.attributes[1].value
    await fetch(`/post/deletePost/${post_id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${isActiveUser()}`
        }
    }).then((res) => res.json()).then((data) => {
        window.location.href = "/dashboard"
    }).catch((err) => console.log(err))

})