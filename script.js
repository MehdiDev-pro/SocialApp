function displayProfile(){
  
  let profileDiv = document.getElementById('profile')
  let home = document.getElementById('home-body')
  let getStarted =  document.getElementById('get-started')
  
  
  getStarted.classList.add("active-started")
  profileDiv.classList.add("is-active")
  home.classList.add("deactive")

  let token = localStorage.getItem("token")
  if(token != null){
    getMyPosts()
  }
}

function displayHome(){
  let profileDiv = document.getElementById('profile')
  let home = document.getElementById('home-body')
  let getStarted = document.getElementById('get-started')
    
  
  getStarted.classList.remove("active-started")
  home.classList.remove("deactive")
  profileDiv.classList.remove("is-active")

  getPosts()
}

function logOut(){
  let permision = confirm("Do you want to log out your account?")
  if(permision == true){
    document.getElementById('profile').innerHTML = ""
    
    document.getElementById('home-footer').classList.toggle("fixed-footer")

    document.getElementById('get-started').classList.toggle("deactive")

    document.getElementById('alert').style.bottom = "8vh"

      showAlert("logged out successfully", "info")
      localStorage.clear()
      displayAddBtn()
  }
}

function showInfoDiv(){
  let editDiv = document.getElementById('edit-section')
  let footer = document.getElementById('home-footer')
  
  
  editDiv.classList.toggle("is-fixed")
  footer.classList.toggle("deactive")
}

function showLogInDiv(){
  document.getElementById('sign-in-div').classList.toggle("is-active")
  
  document.getElementById('get-started').classList.toggle("deactive")

  document.getElementById('home-footer').classList.toggle("deactive")

}

function showSignUpDiv() {
    document.getElementById('sign-up-div').classList.toggle("is-active")
  
  document.getElementById('get-started').classList.toggle("deactive")

  document.getElementById('home-footer').classList.toggle("deactive")
}

function showAddPostDiv(){
  document.getElementById('home-footer').classList.toggle("deactive")
  document.getElementById('add-post-div').classList.toggle("is-fixed")
}

function showEditPostDiv(post){
  document.getElementById('home-footer').classList.toggle("deactive")
  document.getElementById('edit-post-div').classList.toggle("is-fixed") 
  localStorage.setItem("post", post)
  
  let postObj = JSON.parse(decodeURIComponent(post))
  document.getElementById('edit-text').value = postObj.body
      
}

function execute(){
  editPost()
  hideEditPostDiv()
}

function hideEditPostDiv(){
  document.getElementById('home-footer').classList.toggle("deactive")
  document.getElementById('edit-post-div').classList.toggle("is-fixed")
}

function displayAddBtn(){
  
  document.getElementById('add-post-btn-div').classList.toggle("show-add-btn")
}

function displayOptionDiv(){
  let collection = document.getElementsByClassName('option-div')
  for(var i of collection){
     i.style.display = "flex"
  }
}

function deletePostApprove(postObj){
    let permision = confirm("Do you want to delete this post?")
  if(permision == true){
    let post = JSON.parse(decodeURIComponent(postObj))

    deletePost(post)
  }
}

function toggleCommentDiv(){
  document.getElementById('home-body').classList.toggle("deactive")
  document.getElementById('home-footer').classList.toggle("deactive")

  document.getElementById('add-comment-div').classList.toggle("is-active")

  document.getElementById('comment-post').innerHTML = ""
  document.getElementById('comments-div').innerHTML = ""
  getPosts()
}

function showPostComments(postId){ 
  let div = 1
  getComments(postId, div)
  toggleCommentDiv()
}

function toggleMyCommentDiv(){
    document.getElementById('home-footer').classList.toggle("deactive")
  document.getElementById('get-started').classList.toggle("active-started")
  document.getElementById('profile').classList.toggle("is-active")
  
  document.getElementById('add-comment-div').classList.toggle("is-active")

  document.getElementById('comment-post').innerHTML = ""
  document.getElementById('comments-div').innerHTML = ""

  getMyPosts()
}

function showMyPostComments(postId){
  let div = 2
  getComments(postId, div)
  toggleMyCommentDiv()
}

function displayUserProfile(){
  document.getElementById('home-body').classList.toggle("deactive")
  document.getElementById('home-footer').classList.toggle("deactive")
  document.getElementById('user-profile-div').classList.toggle("is-active")
  getPosts()
}

function showUserProfile(userId){
  fillUserProfile(userId)
  displayUserProfile()
}

function toggleUserCommentDiv(userId){
  document.getElementById('user-profile-div').classList.toggle("deactive")
  document.getElementById('add-comment-div').classList.toggle("is-active")

  document.getElementById('comment-post').innerHTML = ""
  document.getElementById('comments-div').innerHTML = ""

  fillUserProfile(userId)
}

function showUserPostComments(postId){
  let div = 3
  getComments(postId, div)
  toggleUserCommentDiv()
}