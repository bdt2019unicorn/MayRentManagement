<a href=".." class="mx-3">Main Page</a>
<a href="." class="mx-3">Issues</a>
<?php 
    require_once("../server/helper/database.php"); 
    $current_environment = new CurrentEnvironment(); 
    $repo = $current_environment->Repo(); 
    $issue_id = $_GET["id"]??null; 
    $url = "https://api.github.com/repos/{$repo->user}/{$repo->repo}/issues"; 
?>