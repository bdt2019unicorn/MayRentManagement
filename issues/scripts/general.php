<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<script>
    function GetIssues(url) 
    {
        let data = SendRequestToGithub(url, {}, "GET");
        try 
        {
            return data.filter(issue => !issue.pull_request);
        }
        catch
        {
            return data;
        }
    }

    function PostIssue()
    {   
        let url = "<?php echo $url; ?>";
        var data = {title: document.getElementById("issue__title").value.trim(), body: document.getElementById("issue__comments").value.trim()}; 
        if(data.title)
        {
            let result = SendRequestToGithub(url, data); 
            if(result.number)
            {
                alert("Issue added"); 
                window.location.href = `./issues.php?id=${result.number}`; 
            }   
            else 
            {
                alert("There seems like to be an issue with the server, please try again."); 
            }
        }
        else 
        {
            alert("Please enter the issue tittle"); 
        }
    }

    function SendRequestToGithub(url, data, type="POST")
    {
        var result; 
        $.ajax
        (
            {
                headers: {Authorization : "Token <?php echo $repo->token;?>"}, 
                type: type, 
                url: url, 
                data: JSON.stringify(data), 
                async: false,
                success: function(success)
                {
                    result = success; 
                }, 
                error: function(error)
                {
                    result = error; 
                }
            }
        ); 
        return result; 
    }
    
    function IssueContentOnchange(div)
    {
        var img = $(div).find("img"); 
        $("#issue__comments").val(img.length?div.innerHTML: div.innerText); 
    }
</script>