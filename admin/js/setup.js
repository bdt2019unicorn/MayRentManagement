function FormSubmit(form, event)
{
    event.preventDefault();
    let form_data = new FormData(form); 
    var data = {}; 
    form_data.forEach((value, key)=>data[key]=value); 
    let result = support_mixin.methods.SubmitData("excel", form.action, [data]); 
    if(Number(result))
    {
        alert("Set Up action success"); 
        sessionStorage.clear(); 
        window.location.href = "login.php"; 
    }
    else
    {
        alert("There seems like a server error! Please try again later."); 
    }
}