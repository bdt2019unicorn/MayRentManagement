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
            <h1>Issue ID: <?php echo $issue_id; ?></h1>
            <form action="#">
                <div class="issue__des container">
                    <div class="issue__title row">
                        <div class="col-md-1">
                            <span>Tên Issue</span> 
                        </div>
                        <div class="col-md-11">
                            <input type="text" name="Tiêu đề" id="showtitle" disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-1">
                            <span>Mô tả lỗi</span> 
                        </div>
                        <div class="col-md-11">
                            <input type="text" name="" id="updatecoment" disabled>
                        </div>
                    </div>
                </div>
                <div class="issue__update container">
                    <div class="row">
                        <div class="col-md-1">
                            <label for="updatecomment">Ý kiến</label>
                        </div>
                        <div class="col-md-11">
                            <textarea name="updatecomment" id="updatecomment" cols="30" rows="10" placeholder="Ý kiến góp thêm"></textarea>
                        </div>         
                    </div>
                    <div class="row text-center">
                        <div class="col-md-1"></div>
                        <div class="btn col-md-10">
                            <input type="submit" value="submit">
                        </div>
                    </div>
                </div> 
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