function CheckUser()
{
    var username = sessionStorage.getItem("username"); 
    var id = sessionStorage.getItem("user_id"); 
    if(username && id)
    {
        var data = 
        {
            username: username, 
            id: id, 
            approved: 1 
        }; 
        let url = "../server/admin_database.php?command=CheckUser"; 
        let result = support_mixin.methods.SubmitData("check_user", url, data); 
        return Boolean(result); 
    }
    else 
    {
        return false; 
    }
}

function Logout()
{
    sessionStorage.clear(); 
    window.location.href = "./login.php"; 
}