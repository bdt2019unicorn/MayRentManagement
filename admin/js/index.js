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