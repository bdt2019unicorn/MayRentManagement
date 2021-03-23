function ShowIssue(data)
{
    document.getElementById("showtitle").innerText=data.title;
    var issue_description = document.getElementById("issue_description"); 
    if(data.body.trim())
    {
        if(data.body.match('<img src=".+"'))
        {
            issue_description.innerHTML = data.body; 
        }
        else 
        {
            issue_description.innerText = data.body; 
        }
    }
    else 
    {
        issue_description.innerText = "There is no description here."; 
    }
    if(data.state=="closed")
    {
        IssueClosedCallBack(); 
    }
}

function IssueClosedCallBack()
{
    document.getElementById("showtitle").className = "text-danger"; 
    document.getElementById("issue_actions").className = "d-none"; 
}

function DivCommentOnText(comment) 
{
    var div = document.createElement("div"); 
    div.innerHTML = comment; 
    if(!div.children.length)
    {
        div.innerText = comment; 
    }
    return div; 
}

function IssueCommentDiv(data, index)
{
    var div = DivCommentOnText(data.body); 
    div.className = `issue__des container-fluid text-${(Number(index)%2==0)? "left": "right"}`; 
    return div; 
}

function IssueComments(url)
{
    url = `${url}/comments`; 
    let data = SendRequestToGithub(url, {}, "GET");
    data.forEach((element, index)=>$("#list__comment").append(IssueCommentDiv(element, index))); 
}

function HandlingEmail(callback) 
{
    var receipient_email = document.getElementById("receipient__email"); 
    if(!receipient_email.hidden)
    {
        var to = receipient_email.value; 
        if(validate({to}, {to: {email: true}}))
        {
            alert("Receipient email is not valid! Please enter it again or untick the notify receipient checkbox"); 
            return false; 
        }  
        let {subject, content} = callback(); 
        SendEmail(to, subject, content); 
        receipient_email.value = ""; 
        receipient_email.hidden = true; 
        document.getElementById("notify__checkbox").checked = false; 

    }
    return true; 
}

function CloseIssue()
{
    if(confirm("Would you like to close the issue?"))
    {
        if
        (
            !HandlingEmail
            (
                ()=>
                (
                    {
                        subject: `Issue #${issue_data.number} - ${issue_data.title} is closed`, 
                        content: 
                        `
                            <p>This is the notification that the issue </b>${issue_data.title}</b> is closed</p>
                            <p>If you believe this is a mistake, please reply to this email or contact the administrator</p>
                            <br>
                            <p>This is an automatic email</p>
                            <p><a href="${window.location.href}">View issue</a>
                        ` 
                    }
                )
            )
        )
        {
            return; 
        }
        UpdateIssue(issue_data.number, {state: "closed"}, IssueClosedCallBack, "Close"); 
    }
}

function SendEmail(to, subject, content)
{
    $.ajax
    (
        {
            url: "server/helper/email.php", 
            data: {to, subject, content}, 
            type: "POST", 
            dataType: "text", 
            success: (result)=>console.log(result)
        }
    ); 
}

function AttachImageCheckboxOnChange(checkbox) 
{
    var textarea_classes = document.getElementById("comment__textarea").classList;
    var contenteditable_classes = document.getElementById("comment__contenteditable").classList; 
    if(checkbox.checked)
    {
        contenteditable_classes.remove("d-none"); 
        textarea_classes.add("d-none"); 
    }
    else 
    {
        contenteditable_classes.add("d-none"); 
        textarea_classes.remove("d-none"); 
    }
}

function IssueCommentOnInput(textarea)
{
    var value = textarea.value; 
    var div = document.createElement("div");
    div.innerHTML = value; 
    var contenteditable = document.getElementById("comment__contenteditable"); 
    if(div.children.length)
    {
        contenteditable.innerHTML = value; 
    }
    else
    {
        contenteditable.innerText = value; 
    }
}