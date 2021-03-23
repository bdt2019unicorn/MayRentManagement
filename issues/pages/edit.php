<?php $url.= "/{$issue_id}";  ?>
<section id="issue">
    <h1 id="showtitle"></h1>
    <div id="issue_description" class="issue__des container-fluid"></div>
    <hr> <br>
    <div id="list__comment"></div>
    <form id="issue_actions" action="#" class="text-center" method="POST">
        <div id="comment__textarea" class="issue__des container-fluid">
            <textarea placeholder="Leave a comment" name="comment" id="issue__comments" cols="30" rows="10" class="issue__textarea form-control" required></textarea>
        </div>
        <div id="comment__contenteditable" contenteditable placeholder="Leave a comment" class="issue__des issue__description container-fluid d-none" oninput="IssueContentOnchange(this)"></div>
        <div class="container-fluid form-check text-left">
            <label class="ml-1 mr-1"><input type="checkbox" onchange="javascript:document.getElementById('receipient__email').hidden = !this.checked;"> Notify receipient</label>
            <label class="ml-1 mr-1"><input type="checkbox" onchange="AttachImageCheckboxOnChange(this)"> Attach Image</label>
        </div>
        <div class="container-fluid form-group text-left m-1">
            <input hidden placeholder="Receipient Email" id="receipient__email" type="email" class="form-control" id="receipient-email" />
        </div>
        <button type="button" class="m-2 btn btn-success text-center float-right" onclick="PostComment()">Comment</button>
        <button type="button" class="m-2 btn btn-danger text-center float-right" onclick="CloseIssue()">Close Issue</button>
    </form>
</section>