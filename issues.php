<html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="css/issues.css">
    </head>
    <body>
        <?php require_once("issues/pages/general.php"); ?>
        <div class="container-fluid">
            <?php 
                if($issue_id)
                {
                    require_once("issues/pages/edit.php"); 
                }
                elseif(isset($_GET["action"]))
                {
                    require_once("issues/pages/add.php"); 
                }
                else
                {
                    require_once("issues/pages/overview.php"); 
                }
            ?>
        </div>
        <footer>
            <?php 
                require_once("issues/scripts/general.php"); 
                if($issue_id)
                {
                    require_once("issues/scripts/edit.php"); 
                }
                else
                {
                    require_once("issues/scripts/overview.php"); 
                }
            ?>
            <script>
                var issue_data; 
                jQuery
                (
                    function()
                    {
                        let url = `<?php echo $url; ?>`; 
                        var data = GetIssues(url); 
                        <?php if($issue_id): ?>
                            issue_data = data; 
                            ShowIssue(data);
                            IssueComments(url); 
                        <?php else: ?>
                            IssueOverview(data);
                            $(".issue__description").empty(); 
                            $(".issue__description").focusout
                            (
                                function()
                                {
                                    if(!this.innerText.trim())
                                    {
                                        $(this).empty(); 
                                    }
                                }
                            ); 
                        <?php endif; ?>
                    }
                ); 
            </script>
        </footer>
    </body>
</html>