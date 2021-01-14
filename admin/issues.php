<html>
    <?php include_once("layout/1.head.php"); ?>
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
                <h1>Ticket ID: <?php echo $issue_id; ?></h1>
                <h2 id="showtitle"></h2>
                <div class="issue__des container-fluid text-center">
                    <h3>Mô tả lỗi</h3>
                    <hr>
                    <p id="updatecoment"></p>
                </div>
                <form action="#" class="text-center">
                    <div class="issue__des container-fluid">
                        <label for="comment">Ý kiến thêm</label>
                        <textarea name="comment" id="comment" cols="30" rows="10" class="form-control"></textarea>
                    </div>
                    <button type="submit" class="btn text-center">Submit</button>
                </form>
            </section>       
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
        </footer>
    </body>
</html>