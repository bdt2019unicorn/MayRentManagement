jQuery
(
    function()
    {
        var check_user = CheckUser(); 
        if(check_user)
        {
            window.location.href = "../admin"; 
        }
        else 
        {
            sessionStorage.clear(); 
        }
    }
); 


function Login(event)
{
    event.preventDefault();
    var form = event.target; 

    let result = support_mixin.methods.AjaxRequest(form.action, new FormData(form), form.method); 
    try
    {
        let user = JSON.parse(result); 
        sessionStorage.setItem("user_id", user.id); 
        sessionStorage.setItem("username", user.username); 
        window.location.href = "../admin"; 
    }
    catch 
    {
        alert("Login Fails! Please try again"); 
    }
}