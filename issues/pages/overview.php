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
            <a class="dropdown-item" href=".?state=open">open</a>
            <a class="dropdown-item" href=".?state=closed">closed</a>
            <a class="dropdown-item" href=".?action=inserted">Create New Issue</a>
        </div>
    </div>
</div>
<br>
<div class="row justify-content-center align-self-center">
    <div id="issues-overview" class="col-10"></div>
</div>