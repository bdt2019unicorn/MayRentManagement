function ShowIssue(data)
{
    document.getElementById("showtitle").innerText=data.title;
    document.getElementById("updatecoment").innerText=data.body|| "There is no description here."; 
    if(data.state=="closed")
    {
        document.getElementById("showtitle").className = "text-danger"; 
        document.getElementById("issue_actions").className = "d-none"; 
    }
}

function IssueCommentDiv(data, index)
{
    var div = document.createElement("div"); 
    div.className = `issue__des container-fluid text-${(Number(index)%2==0)? "left": "right"}`; 
    div.innerHTML = '<p>'+data.body+'</p>'; 
    return div; 
}

function IssueComments(url)
{
    url = `${url}/comments`; 
    let data = SendRequestToGithub(url, {}, "GET");
    data.forEach((element, index)=>$("#list__comment").append(IssueCommentDiv(element, index))); 
}

function CloseIssue()
{
    if(confirm("Would you like to close the issue?"))
    {
        if(confirm("Do you want to notify a recipient about this issue closing?"))
        {
            var to = prompt("Please enter the receipient email or cancel the notification while closing this issue");
            while (true) 
            {
                if(!validate({to}, {to: {email: true}}))
                {
                    break; 
                }    
                else if(confirm("Email is not valid! Would you like to enter the receipient email again?"))
                {
                    to = prompt("Please enter the receipient here?", to)
                }
                else 
                {
                    break; 
                }
            } 
            if(to)
            {
                let subject = `Issue #${issue_data.number} - ${issue_data.title} is closed`; 
                let content = 
                `
                    <p>This is the notification that the issue </b>${issue_data.title}</b> is closed</p>
                    <p>If you believe this is a mistake, please reply to this email or contact the administrator</p>
                `; 
                SendEmail(to, subject, content); 
            }
        }
        console.log(issue_data); 
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
            dataType: "text"         
        }
    ); 
}