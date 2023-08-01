async function onsignup(event){
    event.preventDefault();
    try{
        let myobj = {
            name: event.target.name.value,
            email: event.target.email.value,
            pass: event.target.pass.value
        }

        let op = await axios.post("http://localhost:4000/user/signup",myobj);
        console.log(op.status);
        if(op.status==201){
          alert('Sign up successful');
          window.location.href= '../login/login.html';
        }else{
          throw new Error('failed to signup');
        }
    }catch(err){
      if(err.response==undefined){
        alert(err);
        document.body.innerHTML=`<div class="error_box-container"><div class="error_box">${err}</div></div>`+ document.body.innerHTML;
      }else{
        alert(err.response.data.message)
        document.body.innerHTML=`<div class="error_box-container"><div class="error_box">${err.response.data.message}</div></div>`+ document.body.innerHTML;
      }
      const errbox= document.getElementsByClassName('error_box');
      for(let i=0;i<errbox.length;i++){
        setTimeout(()=>{
          errbox[i].style.display ='none';},3000);
      }
    }   
}

