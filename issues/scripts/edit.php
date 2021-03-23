<script src="https://cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js" integrity="sha512-jjkKtALXHo5xxDA4I5KJyEtYCAqHyOPuWwYFGWGQR2RgOIEFTQsZSDEC5GCdoAKMa8Yay/C+jMW8LCSZbb6YeA==" crossorigin="anonymous"></script>
<script src="issues/js/edit.js"></script>
<script>
    function PostComment()
    {
        var comment = $("#comment").val().trim();  
        if(comment)
        {
            let url = "<?php echo $url; ?>/comments"; 
            var data = {body: comment}; 
            let result = SendRequestToGithub(url, data); 
            if(result.id)
            {
                let index = $("#list__comment").children().length; 
                $("#list__comment").append(IssueCommentDiv(result, index)); 
                $("#comment").val(""); 
            }
            else 
            {
                alert("There seems like an issue with the server, please try again"); 
            }
        }
        else 
        {
            alert("Please enter your comment"); 
        }
    }

    function UpdateIssue(id, data, callback=()=>null, title="Edit",)
    {
        let url = "<?php echo $url;?>"; 
        let result = SendRequestToGithub(url, data, "patch"); 
        if(result)
        {
            alert(`${title} Issue Success`); 
            callback(); 
        }
        else
        {
            alert(`${title} Fails`); 
        }
    }
</script>