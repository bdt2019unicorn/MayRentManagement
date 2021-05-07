<form action="#" class="issue__create text-center" method="POST">
    <h1>Issue Ticket</h1>
    <div class="issue__des container-fluid">                      
        <input placeholder="Title" type="text" name="issue__title" id="issue__title" required>
    </div>
    <div contenteditable placeholder="Description" class="issue__des issue__description container-fluid" oninput="IssueContentOnchange(this)">
    </div>
    <textarea hidden name="issue__comments" id="issue__comments" cols="30" rows="10" class="issue__textarea form-control"></textarea>
    <button type="button" class="btn btn-success text-center" onclick="PostIssue()">Submit</button>
</form>