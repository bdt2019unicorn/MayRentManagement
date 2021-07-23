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
            approved: 1, 
            admin_page: 1 
        }; 
        let url = "../server/controller/admin_database.php?command=CheckUser"; 
        let result = support_mixin.methods.SubmitData("check_user", url, data); 
        return Boolean(Number(result)); 
    }
    else 
    {
        return false; 
    }
}

function Logout(clear = undefined)
{
    if(clear)
    {
        sessionStorage.clear(); 
    }
    window.location.href = "./login.php"; 
}