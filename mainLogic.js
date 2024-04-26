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
toggleLoader(true)
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

}).finally(()=>{
  toggleLoader(false)
})
}
// post requests
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
  function profileClicked(){
    const user=getCurrentUser()
    const userId=user.id
    window.location=`profile.html?userid=${userId}`
  }
function setupUi(){
    let token=localStorage.getItem("token")
    let loginDiv=document.getElementById('logged-in-div')
    let logoutDiv=document.getElementById('logout-div')

    let addBtn=document.getElementById("add-btn")
    if(token==null){
        if(addBtn!=null)
        {
            addBtn.style.setProperty('display','none','important')
        }
      
      loginDiv.style.setProperty('display','flex','important')
      logoutDiv.style.setProperty('display','none','important')

    }else{
        if(addBtn!=null)
        {
            addBtn.style.setProperty('display','block','important')
        }
      loginDiv.style.setProperty('display','none','important')
      logoutDiv.style.setProperty('display','flex','important')
      const user=getCurrentUser()
      document.getElementById('nav-username').innerHTML=user.username
      document.getElementById('nav-user-image').src=user.profile_image
 
    }
  }    
//   auth functions
function loginBtnClicked(){
 
    const username=document.getElementById("username-input").value
    const password=document.getElementById("password-input").value
    let params={
     "username":username,
     "password":password
    }
  // token: 97265|BKxQEmzrZY8Mb3i93pzzM2RYL3fWFFQ1WDNkVZ45
    toggleLoader(true)
    axios.post('https://tarmeezacademy.com/api/v1/login',params) 
    .then(response => {
      localStorage.setItem("token",response.data.token)
      localStorage.setItem("username",JSON.stringify(response.data.user) )
  
      
  
      // hide login 
      const modal=document.getElementById("login-modal")
      const modalInstance=bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
  
      loginSuccessAlert("login successfully",'success')
      setupUi()
  })
  .catch(error => {
    const message=error.response.data.message
      loginSuccessAlert(message,'danger')
  
  }).finally(()=>{
    toggleLoader(false)
  })
  }
function RegisterBtnClick(){
    const registerName=document.getElementById("register-name-input").value
    const registerUsername=document.getElementById("register-username-input").value
    const registerPassword=document.getElementById("register-password-input").value
    let registerImage=document.getElementById('register-image-input').files[0]
   
    let formData=new FormData()
    formData.append("name",registerName)
    formData.append("username",registerUsername)
    formData.append("password",registerPassword)
    formData.append("image",registerImage)
    const headers={
      "Content-Type":"multipart/form-data",
    }
    toggleLoader(true)
    axios.post('https://tarmeezacademy.com/api/v1/register',formData,{
      headers:headers
    }) 
  .then(response => {
      localStorage.setItem("token",response.data.token)
      localStorage.setItem("username",JSON.stringify(response.data.user) )
      // hide register
      const modal=document.getElementById("register-modal")
      const modalInstance=bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
  
      loginSuccessAlert("New User Registered successfully",'success')
      setupUi()
  })
  .catch(error => {
      const message=error.response.data.message
      loginSuccessAlert(message,'danger')
  
  }).finally(()=>{
    toggleLoader(false)
  })
  }
function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    loginSuccessAlert("logout successfully",'danger')
    setupUi()
  }
  

function loginSuccessAlert(message,type){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper)
  }
  
      appendAlert(message, type)
      // todo:
      // setTimeout(()=>{
      //   const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
      //   alertToHide.close()
      // },2000)
  }  
function getCurrentUser(){
    let user=null
    let storageUser=localStorage.getItem("username")
    if(storageUser!=null){
      user=JSON.parse(storageUser)
    }
    return user
  }
  function toggleLoader(show=true){
    if(show){
      document.getElementById('loader').style.visibility="visible"
    }else{
      document.getElementById('loader').style.visibility="hidden"
    }
  }