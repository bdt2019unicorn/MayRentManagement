<script>
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
</script>