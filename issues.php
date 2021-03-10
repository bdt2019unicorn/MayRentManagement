<html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="css/issue.css">
    </head>
    <body>
        <a href="./" class="mx-3">Main Page</a>
        <a href="issues.php" class="mx-3">Issues</a>
        <div class="container-fluid">
            <?php 
                require_once("server/helper/database.php"); 
                $current_environment = new CurrentEnvironment(); 
                $repo = $current_environment->Repo(); 
                $issue_id = $_GET["id"]??null; 
                $url = "https://api.github.com/repos/{$repo->user}/{$repo->repo}/issues"; 
            ?>

            <?php if($issue_id): ?>
                <?php 
                    $url.="/{$issue_id}"; 
                ?>
                <section id="issue">
                    <h1 id="showtitle"></h1>
                    <div class="issue__des container-fluid">
                        <p id="updatecoment"></p>
                    </div>
                    <hr> <br>
                    <div id="list__comment"></div>
                    <form action="#" class="text-center" method="POST">
                        <div class="issue__des container-fluid">
                            <textarea placeholder="Leave a comment" name="comment" id="comment" cols="30" rows="10" class="issue__textarea form-control" required></textarea>
                        </div>
                        <button type="button" class="btn btn-success text-center float-right" onclick="PostComment()">Comment</button>
                    </form>
                </section>
            <?php elseif(isset($_GET["action"])):?>
                <form action="#" class="issue__create text-center" method="POST">
                    <h1>Issue Ticket</h1>
                    <div class="issue__des container-fluid">                      
                        <input placeholder="Title" type="text" name="issue__title" id="issue__title" required>
                    </div>
                    <div class="issue__des container-fluid">
                        <textarea placeholder="Leave a comment" name="issue__comments" id="issue__comments" cols="30" rows="10" class="issue__textarea form-control" required></textarea>
                    </div>
                    <button type="button" class="btn btn-success text-center" onclick="PostIssue()">Submit</button>
                </form>
            <?php else: ?>
                <?php
                    $issue_state = $_GET["state"]??"open"; 
                    $url.= "?state={$issue_state}"; 
                ?>
                <h1>Issues Overview</h1>
                <div class="row justify-content-center align-self-center">
                    <div class="col-4 dropdown">
                        <a class="btn btn-info dropdown-toggle w-100" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <?php echo $issue_state; ?>
                        </a>

                        <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuLink">
                            <a class="dropdown-item" href="./issues.php?state=open">open</a>
                            <a class="dropdown-item" href="./issues.php?state=closed">closed</a>
                            <a class="dropdown-item" href="./issues.php?action=inserted">Create New Issue</a>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row justify-content-center align-self-center">
                    <div id="issues-overview" class="col-10"></div>
                </div>
            <?php endif; ?>
        </div>
        <footer>
            <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
            <script src="js/issues.js"></script>
            <script>
                jQuery
                (
                    function()
                    {
                        let url = `<?php echo $url; ?>`; 
                        var data = GetIssues(url); 
                        <?php if($issue_id): ?>
                            ShowIssue(data);
                            IssueComments(url); 
                        <?php else: ?>
                            IssueOverview(data);
                        <?php endif; ?>
                    }
                ); 

                function PostComment()
                {
                    var comment = $("#comment").val().trim();  
                    if(comment)
                    {
                        let url = "<?php echo $url; ?>"; 
                        var data = {body: comment}; 
                        let result = SendRequestToGithub(`${url}/comments`, data); 
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
                            headers: {Authorization : "<?php echo ($token="Token $repo->token");?>"}, 
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
            </script>
        </footer>
    </body>
</html>