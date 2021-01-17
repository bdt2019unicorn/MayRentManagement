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
                <form action="#" class="text-center" method="POST">
                    <div class="issue__des container-fluid">
                        <label for="comment" class="issue__label">Ý kiến thêm</label>
                        <textarea name="comment" id="comment" cols="30" rows="10" class="issue__textarea form-control" required></textarea>
                    </div>
                    <button type="submit" class="btn__submit btn text-center" onclick="PostComment()">Submit</button>
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
                    <button type="submit" class="btn__submit btn text-center" onclick="PostIssue()">Submit</button>
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
                        let decode_url = `<?php echo base64_encode($url); ?>`; 
                        var data = GetIssues(decode_url); 
                        <?php if($issue_id): ?>
                            ShowIssue(data);
                        <?php else: ?>
                            var issue_overview = IssueOverview(data);
                            $("#issues-overview").append(issue_overview);
                        <?php endif; ?>
                    }
                ); 
            </script>
            <script>
                function PostComment()
                {
                    let url = "https://api.github.com/repos/bdt2019unicorn/MayRentManagement/issues/<?php echo "$issue_id"; ?>/comments"; 
                    var data = {body: document.getElementById("comment").value}; 
                    SendRequestToGithub(url, data); 
                }

                function PostIssue()
                {   
                    let url = "https://api.github.com/repos/bdt2019unicorn/MayRentManagement/issues";
                    var data = {title: document.getElementById("issue__title").value, body: document.getElementById("issue__comments").value}; 
                    SendRequestToGithub(url, data); 
                }

                function SendRequestToGithub(url, data)
                {
                    var result; 
                    $.ajax
                    (
                        {
                            headers: {Authorization : 
                                "<?php 
                                    echo ($token="Token $repo->token");
                                ?>"}, 
                            type: "POST", 
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
