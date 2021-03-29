<script src="https://cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js" integrity="sha512-jjkKtALXHo5xxDA4I5KJyEtYCAqHyOPuWwYFGWGQR2RgOIEFTQsZSDEC5GCdoAKMa8Yay/C+jMW8LCSZbb6YeA==" crossorigin="anonymous"></script>
<script src="issues/js/edit.js"></script>
<script>
    function PostComment()
    {
        var comment = $("#issue__comments").val().trim();  
        if(comment)
        {
            var comment_div = DivCommentOnText(comment); 
            if
            (
                !HandlingEmail
                (
                    ()=>
                    (
                        {
                            subject: `New Comment in Issue #${new URLSearchParams(window.location.search).get("id")} - ${$("#showtitle").text()}`, 
                            content: 
                            `
                                <p><b>New Comment is added, comment content is below</b></p>
                                <div style="border: red; border-style: dotted; margin: 2em; padding: 2em;">
                                    ${comment_div.innerHTML}
                                </div>
                                <div>
                                    <p>This is an automatic message</p>
                                    <p><a href="${window.location.href}">View Issue</a></p>
                                <div>
                            `
                        }
                    )
                )
            )
            {
                return; 
            }
            let url = "<?php echo $url; ?>/comments"; 
            var data = {body: comment}; 
            let result = SendRequestToGithub(url, data); 
            if(result.id)
            {
                let index = $("#list__comment").children().length; 
                $("#list__comment").append(IssueCommentDiv(result, index)); 
                $("#issue__comments").val(""); 
                $("#comment__textarea").removeClass("d-none"); 
                document.getElementById("attach__image_checkbox").checked = false; 
                var contenteditable = $("#comment__contenteditable"); 
                contenteditable.html(""); 
                contenteditable.addClass("d-none"); 

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