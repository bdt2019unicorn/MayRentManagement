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
                <h3><?php echo $url; ?></h3>
            <?php endif; ?>
        </div>
        <footer>
            <?php include_once("layout/3.footer.php"); ?>
        </footer>
    </body>
</html>