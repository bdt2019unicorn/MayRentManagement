jQuery 
(
    function()
    {
        var check_user = CheckUser(); 
        if(!check_user)
        {
            Logout(); 
        }
    }
); 

function Logout()
{
    sessionStorage.clear(); 
    window.location.href = "./login.php"; 
}