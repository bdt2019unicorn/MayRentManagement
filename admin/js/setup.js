function FormSubmit(form, event, redirect = true)
{
    event.preventDefault();
    data = Object.fromEntries(new FormData(form)); 
    if(form.getAttribute('data-whitespace'))
    {
        let form_data = {}; 
        for(key in data)
        {
            let value = data[key].trim(); 
            if(value.includes(" "))
            {
                alert("Please make sure the values does not contain white space"); 
                return; 
            }
            form_data[key] = value; 
        }
        data = form_data; 
    }
    let result = support_mixin.methods.SubmitData("excel", form.action, [data]); 
    if(Number(result))
    {
        alert("Set Up action success"); 
        if(redirect)
        {
            sessionStorage.clear(); 
            window.location.href = "login.php"; 
        }
        else 
        {
            window.location.reload(); 
        }
    }
    else
    {
        alert("There seems like a server error! Please try again later."); 
    }
}