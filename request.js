 let currentPage = 1
let lastPage = 1

function getUser() {
  let userStr = localStorage.getItem("user")
  let userObj = JSON.parse(userStr)
  return userObj
}

function scrollHandle() {
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight

  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1
    getPosts(currentPage)

  }
}

function showAlert(message, color = "success") {

  let alertDiv = document.getElementById('alert')
  alertDiv.style.transition = "opacity 0s"
  alertDiv.style.opacity = "1"

  const alertPlaceholder = document.getElementById('alert')

  const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  alert(message, color)

  setTimeout(() => {
    alertDiv.style.transition = "opacity 1s"
    alertDiv.style.opacity = "0"
    setTimeout(() => {
      alertDiv.innerHTML = ""
    }, 1000)
  }, 3000)

}

function getPosts(page = 1) {

  let loader = document.getElementById('loader')
  loader.style.visibility = "visible"
  loader.style.height = "100vh"

  let body = document.getElementById('body-nested-posts')

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  let token = localStorage.getItem("token")
  let user = ""
  let localId = ""
  if (token == null) {
    localId = null
  } else {
    user = getUser()
    localId = user.user.id
  }

  if (page == 1) {
    body.innerHTML = ""
  }
  axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`, requestOptions)
    .then(response => {
      let profileImage = ""

      loader.style.height = "100px"
      body.style = "padding-top: 12.2%"

      lastPage = response.data.meta.last_page
      let posts = response.data.data
      let optionDiv = ''
      for (var post of posts) {

        // nesting profile image //
        profileImg = post.author.profile_image

        if (typeof profileImg == "object") {
          profileImage = `<img src="./images/user.jpeg" />`
        } else {
          profileImage = `<img src="${profileImg}" />`
        }
        // nesting profile image //

        // nesting tags //
        let tagsArr = []
        let tagBody = ""
        let tags = post.tags
        for (var tag of tags) {
          let tagName = tag.name
          tagBody = `<h3>${tagName}</h3>`
          tagsArr.push(tagBody)
        }
        let newTagsArr = tagsArr.toString().replaceAll(",", "")
        // nesting tags //

        let userId = post.author.id
        if (userId == localId) {
          optionDiv = `
                  <div class="option-div">
              <div class="btn-group">
  <button id="btn" type="button" class="btn   dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    <span id="post-option" class="material-symbols-rounded">
more_vert
</span>
  </button>
  <ul class="dropdown-menu">
    <li><button onclick="deletePostApprove('${encodeURIComponent(JSON.stringify(post))}')" id="delete-btn" class="dropdown-item" href="#">Delete Post</button></li>
    <li><button onclick="showEditPostDiv('${encodeURIComponent(JSON.stringify(post))}')" class="dropdown-item" href="#">Edit Post</button></li>
  </ul>
              </div>
           </div>
        `
        } else if (userId == null) {
          optionDiv = ""
        } else {
          optionDiv = ""
        }

        let date = post.created_at

        body.innerHTML += `
      <div class="post">
         <div class="post-nav">
           <div class="post-user">
            <div onclick="showUserProfile(${userId})" class="post-user-info" id="user-post-info">
              <div class="user-img">
               ${profileImage}
            </div>
            <h3 class="user-name">
               ${post.author.username}
            </h3>
            </div>
           </div>
           ${optionDiv}
         </div>
         <div class="post-body">
            <img id="image" src="${post.image}" />
         </div>
         <div class="post-footer">
            <div class="post-title">
               <h4>
                  ${post.body}
               </h4>
              <div class="post-info">
               <div class="post-date">
                  ${date}
               </div>
               <div class="post-tags">
               ${newTagsArr}
               </div>
              </div>
            </div>
            <div class="post-cmnt">
                <div class="add-cmnt-btn-div">
                  <button onclick="showPostComments(${post.id})" id="add-cmnt-btn" class="add-cmnt-btn">
                  <span class="material-symbols-rounded cmnt-sign">
textsms
                </span>
                  </button> 
                </div>
                <div class="cmnt-count">
                   ${post.comments_count}
                </div>
            </div>  
         </div>
      </div>

      `
      }
      document.getElementById('home-body').style = "padding-bottom: 8vh"
    })
    .catch(er => {
      let error = er.response.data.message
      document.getElementById('alert').style.bottom = "5px"
      showAlert(`please try again`, "danger")
    })
}

function getMyPosts() {

  let user = getUser()
  let id = user.user.id

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`, requestOptions)
    .then(res => {
      let profileImage = ""
      document.getElementById('my-nested-posts').innerHTML = ""
      let posts = res.data.data.reverse()
      let index = 1
      for (var post of posts) {

        // nesting profile image //
        profileImg = post.author.profile_image

        if (typeof profileImg == "object") {
          profileImage = `<img src="./images/user.jpeg" />`
        } else {
          profileImage = `<img src="${profileImg}" />`
        }
        // nesting profile image //

        // nesting tags //
        let tagsArr = []
        let tagBody = ""
        let tags = post.tags
        for (var tag of tags) {
          let tagName = tag.name
          tagBody = `<h3>${tagName}</h3>`
          tagsArr.push(tagBody)
        }
        let newTagsArr = tagsArr.toString().replaceAll(",", "")
        // nesting tags //


        let date = post.author.created_at
        document.getElementById('my-nested-posts').innerHTML += `
      <div id="post${index}" class="post">
         <div class="post-nav">
           <div class="post-user">
              <div class="user-img">
               ${profileImage}
            </div>
            <h3 class="user-name">
               ${post.author.username}
            </h3>
           </div>
          <div class="option-div">
              <div class="btn-group">
  <button id="btn" type="button" class="btn   dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    <span id="post-option" class="material-symbols-rounded">
more_vert
</span>
  </button>
  <ul class="dropdown-menu">
    <li><button onclick="deletePostApprove('${encodeURIComponent(JSON.stringify(post))}')" id="delete-btn" class="dropdown-item" href="#">Delete Post</button></li>
    <li><button onclick="showEditPostDiv('${encodeURIComponent(JSON.stringify(post))}')" class="dropdown-item" href="#">Edit Post</button></li>
  </ul>
              </div>
           </div>
         </div>
         <div class="post-body">
            <img id="image" src="${post.image}" />
         </div>
         <div class="post-footer">
            <div class="post-title">
               <h4>
                  ${post.body}
               </h4>
              <div class="post-info">
               <div class="post-date">
                  ${extractDate(date)}
               </div>
               <div class="post-tags">
               ${newTagsArr}
               </div>
              </div>
            </div>
            <div class="post-cmnt">
                                <div class="add-cmnt-btn-div">
                  <button onclick="showMyPostComments(${post.id})" 
                  id="add-cmnt-btn" class="add-cmnt-btn">
                  <span class="material-symbols-rounded cmnt-sign">
textsms
                </span>
                  </button> 
                </div>
                <div class="cmnt-count">
                   ${post.comments_count}
                </div>
              
            </div>  
         </div>
      </div>

      `
        index++
      }
    })
    .catch(er => {
      // let error = er.response.data.message
      // document.getElementById('alert').style.bottom = "5px"
      // showAlert(`please try again`, "danger")
    })
}

function extractDate(date) {
  let newDate = Array.from(date).splice(0, 10).toString().replaceAll(",", "").replaceAll("-", "/")
  return newDate
}

function logIn() {
  let userName = document.getElementById('username').value
  let password = document.getElementById('password').value

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var params = {
    "username": userName,
    "password": password
  }
  axios.post("https://tarmeezacademy.com/api/v1/login", params)
    .then(response => {
      let data = response.data
      console.log(data);
      let info = {
        id: data.user.id,
        token: data.token,
        postsCount: data.user.posts_count,
        name: data.user.name,
        username: data.user.username,
        profileImg: data.user.profile_image,
        email: data.user.email
      }

      localStorage.setItem("user", JSON.stringify(data))
      localStorage.setItem("token", info.token)

      document.getElementById('alert').style.bottom = "8vh"
      showAlert(`Welcome ${info.name}`)
      return info
    })
    .then(res => {
      let isEmail = ""
      if(res.email != null){
        isEmail = `<h1>
          ${res.email}<span>Email</span>
        </h1>`
      }
           
      showLogInDiv()
      displayAddBtn()

      let profileImage = ""

      // nesting profile image //
      profileImg = res.profileImg

      if (typeof profileImg == "object") {
        profileImage = `<img src="./images/user.jpeg" />`
      } else {
        profileImage = `<img src="${profileImg}" />`
      }
      // nesting profile image //

      let profile = document.getElementById('profile')
      profile.innerHTML = `
    <div id="my-profile" class="my-profile">
         <div id="edit-section" class="edit-section">
        <div id="cancel-div">
           <button onclick="showInfoDiv()" id="cancel-btn">
             Cancel
           </button>
        </div>
  
        <div id="more-info">
        <h1>
          ${res.name}<span>Name</span>
        </h1>
        <h1>
          ${res.username}<span>Username</span>
        </h1>
        ${isEmail} 
        </div>     
      </div>
      
      <div id="profile-edit">
         <button onclick="showInfoDiv()" id="edit-pro-btn">
           Profile Information
           <span class="material-symbols-rounded">
person_add
           </span>
         </button>
         <button onclick="logOut()" id="logout-btn">Log Out
           <span class="material-symbols-rounded">
logout
           </span>
         </button>
       </div>

       
      <div id="profile-img">
          ${profileImage}
       </div>
      <div id="my-username">
          <h2>
            ${res.username}
          </h2>
      </div>
      
     </div>

     
      <div id="my-posts" class="my-posts">
        <div id="my-post-header">
           <div id="header">
            <h1>
               <span id="post-count">${res.postsCount}</span> posts
            </h1>
           </div>
        </div>
        <div id="my-nested-posts">
           
        </div>
      </div>
     </div>
    `
      getMyPosts()
    })
    .catch(er => {
      let error = er.response.data.message
      document.getElementById('alert').style.bottom = "5px"
      showAlert(error, "danger")
    })
}

function register() {

  let name = document.getElementById('name').value

  let userName = document.getElementById('user-name').value

  let password = document.getElementById('pass-word').value

  let email = document.getElementById('email').value

  let image = document.getElementById('image-input').files[0]


  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var formdata = new FormData();
  formdata.append("name", `${name}`)
  formdata.append("username", `${userName}`);
  formdata.append("password", `${password}`)

  if (image != undefined) {
    formdata.append("image", image)
  }
  if (email != "") {
    formdata.append("email", email)
  }
  axios.post("https://tarmeezacademy.com/api/v1/register", formdata)
    .then(response => {

      let data = response.data

      let info = {
        id: data.user.id,
        token: data.token,
        postsCount: data.user.posts_count,
        name: data.user.name,
        username: data.user.username,
        profileImg: data.user.profile_image,
        email: data.user.email
      }

      localStorage.setItem("user", JSON.stringify(data))
      localStorage.setItem("token", info.token)

      document.getElementById('alert').style.bottom = "8vh"
      showAlert(`successfully registered. Welcome ${info.name}`)
      return info
    })
    .then(res => {
      let isEmail = ""
      if(res.email != null){
        isEmail = `<h1>
          ${res.email}<span>Email</span>
        </h1>`
      }
      
      showSignUpDiv()
      displayAddBtn()

      let profileImage = ""

      // nesting profile image //
      profileImg = res.profileImg

      if (typeof profileImg == "object") {
        profileImage = `<img src="./images/user.jpeg" />`
      } else {
        profileImage = `<img src="${profileImg}" />`
      }
      // nesting profile image //


      document.getElementById('get-started').classList.toggle("deactive")

      let profile = document.getElementById('profile')
      profile.innerHTML = `
    <div id="my-profile" class="my-profile">
         <div id="edit-section" class="edit-section">
        <div id="cancel-div">
           <button onclick="showInfoDiv()" id="cancel-btn">
             Cancel
           </button>
        </div>
  
        <div id="more-info">
        <h1>
          ${res.name}<span>Name</span>
        </h1>
        <h1>
          ${res.username}<span>Username</span>
        </h1>
          ${isEmail}
        </div>     
      </div>
      
      <div id="profile-edit">
         <button onclick="showInfoDiv()" id="edit-pro-btn">
           Profile Information
           <span class="material-symbols-rounded">
manage_accounts
           </span>
         </button>
         <button onclick="logOut()" id="logout-btn">Log Out
           <span class="material-symbols-rounded">
logout
           </span>
         </button>
       </div>

       
      <div id="profile-img">
          ${profileImage}
       </div>
      <div id="my-username">
          <h2>
            ${res.username}
          </h2>
      </div>
      
     </div>

     
      <div id="my-posts" class="my-posts">
        <div id="my-post-header">
           <div id="header">
            <h1>
               <span id="post-count">${res.postsCount}</span> posts
            </h1>
           </div>
        </div>
        <div id="my-nested-posts">
           
        </div>
      </div>
     </div>
    `
    })
    .catch(er => {

      let error = er.response.data.message
      document.getElementById('alert').style.bottom = "5px"
      showAlert(error, "danger")

    })
}

function createPost() {

  let image = document.getElementById('choose-img').files[0]
  let body = document.getElementById('body-text').value
  let token = localStorage.getItem("token")

  var formdata = new FormData();
  formdata.append("body", body);
  formdata.append("image", image);

  let myHeaders = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  }


  axios.post("https://tarmeezacademy.com/api/v1/posts", formdata, {
    headers: myHeaders
  })
    .then(result => {
      let postCount = document.getElementById('post-count').innerHTML
      document.getElementById('post-count').innerHTML = Number(postCount) + 1
      showAlert("New post Added")
      showAddPostDiv()
      getMyPosts()
      getPosts()
    })
    .catch(er => {
      let error = er.response.data.message
      document.getElementById('alert').style.bottom = "5px"
      showAlert(error, "danger")
    })
}

function deletePost(post) {

  let postId = post.id
  let token = localStorage.getItem("token")

  let myHeaders = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  }

  axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
    headers: myHeaders
  })
    .then(result => {
      let postCount = document.getElementById('post-count').innerHTML
      document.getElementById('post-count').innerHTML = Number(postCount) - 1

      showAlert("Post successfully deleted")
      getMyPosts()
      getPosts()
    })
    .catch(er => {
      console.log(er);
    })
}

function editPost() {

  let postObj = localStorage.getItem("post")
  let token = localStorage.getItem("token")

  let post = JSON.parse(decodeURIComponent(postObj))
  let postId = post.id

  let image = document.getElementById('choose-edit-img').files[0]

  let body = document.getElementById('edit-text').value

  let myHeaders = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  }

  let formdata = new FormData();
  formdata.append("body", body);
  formdata.append("_method", "put");

  if (image != undefined) {
    formdata.append("image", image)
  }
  axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formdata, {
    headers: myHeaders
  })
    .then(result => {
      showAlert("Post successfully edited")
      getMyPosts()
      getPosts()
    })
    .catch(er => {
      let error = er.response.data.message
      document.getElementById('alert').style.bottom = "5px"
      showAlert(error, "danger")
    })
}

function getComments(postId, div) {

  let token = localStorage.getItem("token")

  let user = ""
  let localId = ""
  let userImage = ""
  if (token == null) {
    localId = null
  } else {
    user = getUser()
    localId = user.user.id
    userImage = user.user.profile_image
  }

  let myHeaders = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  }
  axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
    headers: myHeaders
  })
    .then(res => {

      let data = res.data.data

      let items = {
        userId: data.author.id,
        comments: data.comments,
        userImg: data.author.profile_image,
        userName: data.author.username,
        bodyImg: data.image,
        body: data.body,
        date: data.created_at,
        tags: data.tags,
        commentCount: data.comments_count
      }
      return items
    })
    .then(items => {

      let profileImage = ""

      // nesting profile image //
      profileImg = items.userImg

      if (typeof profileImg == "object") {
        profileImage = `<img src="./images/user.jpeg" />`
      } else {
        profileImage = `<img src="${profileImg}" />`
      }
      // nesting profile image //

      // nesting tags //
      let tagsArr = []
      let tagBody = ""
      let tags = items.tags
      for (var tag of tags) {
        let tagName = tag.name
        tagBody = `<h3>${tagName}</h3>`
        tagsArr.push(tagBody)
      }
      let newTagsArr = tagsArr.toString().replaceAll(",", "")
      // nesting tags //

      let CancelDiv = ""

      if (div == 1) {
        CancelDiv = `
    <button onclick="toggleCommentDiv()" id="cancel-btn">
          Cancel
        </button>
        <h2>
          Comments
        </h2>
    `
      } else if (div == 2) {
        CancelDiv = `
    <button onclick="toggleMyCommentDiv()" id="cancel-btn">
          Cancel
        </button>
        <h2>
          Comments
        </h2>
    `
      } else if (div == 3) {
        CancelDiv = `
    <button onclick="toggleUserCommentDiv(${items.userId})" id="cancel-btn">
          Cancel
        </button>
        <h2>
          Comments
        </h2>
    `
      }

      document.getElementById('cancel-cmnt-div').innerHTML = CancelDiv


      document.getElementById('comment-post').innerHTML = `
        <div class="post">
          <div class="post-nav">
            <div class="post-user">
              <div class="user-img">
                ${profileImage}
              </div>
              <h3 class="user-name">
                ${items.userName}
              </h3>
            </div>
          </div>
          <div class="post-body">
            <img id="image" src="${items.bodyImg}" />
          </div>
          <div class="post-footer">
            <div class="post-title">
              <h4>
                ${items.body}
              </h4>
              <div class="post-info">
                <div class="post-date">
                  ${items.date}
                </div>
                <div class="post-tags">
               ${newTagsArr}
                </div>
              </div>
            </div>
            <div class="post-cmnt">
              <div class="cmnt-count">
                ${items.commentCount}
              </div>
            </div>
          </div>
        </div>
    `

      let comments = items.comments.reverse()
      let commentDiv = document.getElementById('comments-div')
      commentDiv.innerHTML = ""
      for (var comment of comments) {
        console.log(comment);
        let cmntImage = ""

        // nesting profile image //
        var cmntImg = comment.author.profile_image

        if (typeof cmntImg == "object") {
          cmntImage = `<img src="./images/user.jpeg" />`
        } else {
          cmntImage = `<img src="${cmntImg}" />`
        }
        // nesting profile image //

        commentDiv.innerHTML += `
      <div class="comment">
            <div class="comment-user-image">
               <div class="user-img">
                  ${cmntImage}
               </div>
            </div>
            <div class="comment-info">
              <div class="cmnt-user-name">
                 <h3 class="user-name">
                    ${comment.author.username}
                 </h3>
              </div>
              <div class="cmnt-body">
                ${comment.body}
              </div>
            </div>            
         </div>
      `
      }

      let inputDiv = ""
      document.getElementById('cmnt-input').style.display = "none"

      if (token != null) {
        document.getElementById('cmnt-input').style.display = "flex"
        inputDiv = `
             <div class="user-img">
                  <img src="${userImage}" />
       </div>
       <div id="input-items">
        <input id="add-cmnt-input" type="text" placeholder="add a comment"/>
        <button onclick="createcomment(${postId}, ${div})">
              post
        </button>
       </div>
      `
      } else if (token == null) {
        document.getElementById('alert').style.bottom = "0"
        showAlert("Login your account to add comments", "info")
      }

      document.getElementById('cmnt-input').innerHTML = inputDiv

    })
    .catch(error => console.log('error/:', error));
}

function createcomment(postId, div) {
  let token = localStorage.getItem("token")

  let body = document.getElementById('add-cmnt-input').value

  let myHeaders = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  }

  let formdata = new FormData();
  formdata.append("body", body);

  axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`, formdata, {
    headers: myHeaders
  })
    .then(result => {
      showAlert("New comment added")
      getComments(postId, div)
    })
    .catch(error => console.log('error:', error));
}

function fillUserProfile(userId) {
  let token = localStorage.getItem("token")

  let user = ""
  let localId = ""
  if (token == null) {
    localId = null
  } else {
    user = getUser()
    localId = user.user.id
  }

  if (userId == localId) {
    displayProfile()
    displayUserProfile()
    return
  }

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}`, requestOptions)
    .then(res => {
      let data = res.data.data
      let info = {
        userName: data.username,
        profileImg: data.profile_image,
        postCount: data.posts_count,
        commentCount: data.comments_count
      }
      return info
    })
    .then(info => {

      let profileImage = ""

      // nesting profile image //
      profileImg = info.profileImg

      if (typeof profileImg == "object") {
        profileImage = `<img src="./images/user.jpeg" />`
      } else {
        profileImage = `<img src="${profileImg}" />`
      }
      // nesting profile image //

      document.getElementById('user-prof-info').innerHTML = `
            <div id="user-profile-img">
          ${profileImage}
        </div>
        <div id="user-username">
          <h1>
             ${info.userName}
          </h1>
        </div>       
        <div id="user-profile-status">
          <div id="posts-count">
            <h1>
               <span>${info.postCount}</span> posts
            </h1>
          </div>
          <div id="comments-count">
             <h1>
                <span>${info.commentCount}</span>comments
             </h1>
          </div>
        </div>
    `
    })
    .then(result => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`, requestOptions)
        .then(res => {

          let posts = res.data.data.reverse()

          let userPostsDiv = document.getElementById('user-posts')
          userPostsDiv.innerHTML = ""
          for (var post of posts) {

            let profileImage = ""

            // nesting profile image //
            profileImg = post.author.profile_image

            if (typeof profileImg == "object") {
              profileImage = `<img src="./images/user.jpeg" />`
            } else {
              profileImage = `<img src="${profileImg}" />`
            }
            // nesting profile image //

            // nesting tags //
            let tagsArr = []
            let tagBody = ""
            let tags = post.tags
            for (var tag of tags) {
              let tagName = tag.name
              tagBody = `<h3>${tagName}</h3>`
              tagsArr.push(tagBody)
            }
            let newTagsArr = tagsArr.toString().replaceAll(",", "")
            // nesting tags //

            userPostsDiv.innerHTML += `
      <div class="post">
         <div class="post-nav">
           <div class="post-user">
            <div class="post-user-info" id="user-post-info">
              <div class="user-img">
               ${profileImage}
            </div>
            <h3 class="user-name">
               ${post.author.username}
            </h3>
            </div>
           </div>
           
         </div>
         <div class="post-body">
            <img id="image" src="${post.image}" />
         </div>
         <div class="post-footer">
            <div class="post-title">
               <h4>
                  ${post.body}
               </h4>
              <div class="post-info">
               <div class="post-date">
                  ${post.created_at}
               </div>
               <div class="post-tags">
                ${newTagsArr}
               </div>
              </div>
            </div>
            <div class="post-cmnt">
                <div class="add-cmnt-btn-div">
                  <button onclick="showUserPostComments(${post.id})" id="add-cmnt-btn" class="add-cmnt-btn">
                  <span class="material-symbols-rounded cmnt-sign">
textsms
                </span>
                  </button> 
                </div>
                <div class="cmnt-count">
                   ${post.comments_count}
                </div>
            </div>  
         </div>
      </div>

      `
          }
        })
        .catch(error => console.log("error:" + error))
    })
    .catch(error => console.log('error', error));
}