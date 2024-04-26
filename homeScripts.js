let currentPage=1
let lastPage=1
// infinite scroll
 window.addEventListener("scroll",()=>{
  const endOfPage=window.innerHeight +window.pageYOffset >=document.body.scrollHeight;
  if(endOfPage && currentPage<lastPage){
    currentPage=currentPage+1
    getPosts(false,currentPage)
    
  }
 })
// infinite scroll
setupUi()
getPosts()


function userClicked(userId){
  window.location=`profile.html?userid=${userId}`
}

function getPosts(reload=true,page=1){
  toggleLoader(true)
  axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=22&page=${page}`)
  .then((response)=>{
  toggleLoader(false)
  const posts=response.data.data
  lastPage=response.data.meta.last_page
 if(reload){
     document.querySelector("#posts").innerHTML="";
 }
  
 for(post of posts){
  
    let postTitle="";

    // show or hide (edit) button
    let user=getCurrentUser() 
    let isMyPost=user !=null && post.author.id==user.id 
    let editBtnContent=``
    if(isMyPost){
      editBtnContent=`
      <button class="btn btn-danger"style="margin-left:5px; float: right;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
      <button class="btn btn-secondary"style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
     `
    }
    if(post.title!=null){
      postTitle=post.title
    }
    let content=`
    <div class="card shadow">
        <div class="card-header">
          <span onclick="userClicked(${post.author.id})"style="cursor: pointer;">
            <img class="border border-2 rounded-circle" src=${post.author.profile_image} alt="" style="width: 40px;height: 40px;">
            <b>${post.author.username}</b>
          </span>
           ${editBtnContent}
        </div>
        <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
          <img class="w-100"  src=${post.image} alt="">
          <h6 class="mt-1" style="color: rgb(193, 193, 193);">${post.created_at}</h6>
          <h5>${postTitle}</h5>
          <p>${post.body}</p>
          <hr>
          <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                          </svg>
                          <span>${post.comments_count}</span>
                      </div>
        </div>
      </div>
    `
    document.querySelector("#posts").innerHTML+=content
  }
})
}
function postClicked(postId){

  window.location=`postDetails.html?postId=${postId}`
  
  }

function createNewPostClicked(){
    let postId=document.getElementById("post-id-input").value
    let isCreate= postId==null || postId==""
    const title=document.getElementById("post-title-input").value
    const body=document.getElementById("post-body-input").value
    const image=document.getElementById("post-image-input").files[0]
    let token=localStorage.getItem("token")

  let formData=new FormData()
  formData.append('body',body)
  formData.append('title',title)
  formData.append('image',image)

  const headers={
    "Content-Type":"multipart/form-data",
    "authorization":`Bearer ${token}`
  }
  if(isCreate){
    url=`https://tarmeezacademy.com/api/v1/posts`
  
  }else{
    // formData.append("_method","put")
    url=`https://tarmeezacademy.com/api/v1/posts/${postId}`
   
  }
  axios.post('https://tarmeezacademy.com/api/v1/posts',formData,{
    headers:headers
  }) 
.then(response => {
    let modal=document.getElementById("create-post-modal")
    const modalInstance=bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
  loginSuccessAlert('Your Post Has Been Edited','success')
  getPost()
}).catch((error)=>{
    const message=error.response.data.message
    loginSuccessAlert(message,'danger')

})
}
function editPostBtnClicked(postObject){

let post=JSON.parse(decodeURIComponent(postObject))
console.log(post)
document.getElementById("post-modal-submit-btn").innerHTML='Update'
document.getElementById("post-id-input").value=post.id
document.getElementById('post-modal-title').innerHTML="Edit Post"
document.getElementById('post-title-input').value=post.title
document.getElementById('post-body-input').value=post.body
let postModal=new bootstrap.Modal(document.getElementById('create-post-modal'),{})
postModal.toggle()
}
function deletePostBtnClicked(postObject){
  let post=JSON.parse(decodeURIComponent(postObject))
  console.log(post)
  document.getElementById("delete-post-id-input").value=post.id
  let postModal=new bootstrap.Modal(document.getElementById('delete-post-modal'),{})
  postModal.toggle()
}
function confirmPostDelete(){
  const postId=document.getElementById("delete-post-id-input").value
  let token=localStorage.getItem("token")
  const headers = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  } 
  axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
      headers: headers
  }).then((response) => {
    // hide login 
    const modal=document.getElementById("delete-post-modal")
    const modalInstance=bootstrap.Modal.getInstance(modal)
    modalInstance.hide()

    loginSuccessAlert("The Post Has Been Deleted Successfully", "success")
    getPosts()
})
.catch(error => {
  const message = error.response.data.message
  loginSuccessAlert(message, "danger")

});
}
function addBtnClick(){

document.getElementById("post-modal-submit-btn").innerHTML='Create'
document.getElementById("post-id-input").value=""
document.getElementById('post-modal-title').innerHTML="Create A New Post"
document.getElementById('post-title-input').value=""
document.getElementById('post-body-input').value=""
let postModal=new bootstrap.Modal(document.getElementById('create-post-modal'),{})
postModal.toggle()
}
