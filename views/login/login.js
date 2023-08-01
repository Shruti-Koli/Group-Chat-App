async function onlogin(event){
  event.preventDefault();
  try{
      let myobj = {
          email: event.target.email.value,
          pass: event.target.pass.value
      }

      let op = await axios.post("http://localhost:4000/user/login",myobj);
      localStorage.setItem('token',op.data.token);
      if(op.status==201){
        console.log("login successful")
        // window.location.href= '';
      }else{
        throw new Error('failed to signup');
      }
  }catch(err){
    if(err.response==undefined){
      document.body.innerHTML=`<div class="error_box-container"><div class="error_box">${err}</div></div>`+ document.body.innerHTML;
    }else{
      
      document.body.innerHTML=`<div class="error_box-container"><div class="error_box">${err.response.data.message}</div></div>`+ document.body.innerHTML;
    }
    const errbox= document.getElementsByClassName('error_box');
    for(let i=0;i<errbox.length;i++){
      setTimeout(()=>{
        errbox[i].style.display ='none';},3000);
    }
  }   
}
