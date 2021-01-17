<html>
    <?php include_once("layout/1.head.php"); ?>
    <link rel="stylesheet" type="text/css" href="css/issue.css">
    <body>
        <div class="container-fluid">
            <?php 
                $issue_id = $_GET["id"]??null; 
                $repo = file_get_contents("repo.json"); 
                $repo = json_decode($repo); 
                $url = "https://api.github.com/repos/{$repo->user}/{$repo->repo}/issues"; 
            ?>

            <?php if($issue_id): ?>
                <?php 
                    $url.="/{$issue_id}"; 
                ?>
            <section id="issue">
                <h1 id="showtitle"></h1>
                <div class="issue__des container-fluid text-center">
                    <h3>Mô tả lỗi</h3>
                    <hr>
                    <p id="updatecoment"></p>
                </div>
                <div id="list__comment"></div>
                <form action="#" class="text-center" method="POST">
                    <div class="issue__des container-fluid">
                        <label for="comment" class="issue__label">Ý kiến thêm</label>
                        <textarea name="comment" id="comment" cols="30" rows="10" class="issue__textarea form-control" required></textarea>
                    </div>
                    <button type="button" class="btn__submit btn text-center" onclick="PostComment()">Submit</button>
                </form>
            </section>
            <?php elseif(isset($_GET["action"])):?>
                <form action="#" class="issue__create text-center" method="POST">
                    <h1>Issue Ticket</h1>
                    <div class="issue__des container-fluid">                      
                        <label for="issue__title" class="issue__label">Tiêu đề</label>
                        <input type="text" name="issue__title" id="issue__title" required>
                    </div>
                    <div class="issue__des container-fluid">
                        <label for="issue__comments" class="issue__label">Mô tả lỗi</label>
                        <textarea name="issue__comments" id="issue__comments" cols="30" rows="10" class="issue__textarea form-control" required></textarea>
                    </div>
                    <button type="button" class="btn__submit btn text-center" onclick="PostIssue()">Submit</button>
                </form>
            <?php else: ?>
                <?php
                    $issue_state = $_GET["state"]??"all"; 
                    $url.= "?state={$issue_state}"; 
                ?>
                <h1>Issues Overview</h1>
                <div class="row justify-content-center align-self-center">
                    <div class="col-4 dropdown">
                        <a class="btn btn-info dropdown-toggle w-100" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <?php echo $issue_state; ?>
                        </a>

                        <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuLink">
                            <a class="dropdown-item" href="./issues.php?state=all">all</a>
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
            <?php include_once("layout/3.footer.php"); ?>
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
                            $("#list__comment").append(IssueCommentDiv(result)); 
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
