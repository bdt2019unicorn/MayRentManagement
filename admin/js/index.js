jQuery 
(
    function()
    {
        var check_user = CheckUser(); 
        if(!check_user)
        {
            window.location.href = "../admin/login.php"; 
        }
    }
); 

function Logout()
{
    console.log("test"); 
}