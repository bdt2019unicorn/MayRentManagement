function GetIssues(decode_url)
{
    let url = atob(decode_url); 
    let data = support_mixin.methods.AjaxRequest(url); 
    try 
    {
        return data.filter(issue=>!issue.pull_request); 
    }
    catch
    {
        return data; 
    }
}

function IssueOverview(data)
{
    var div = document.createElement("div"); 
    data.forEach(issue => div.append(IssueDiv(issue)));
    return div; 
}


function IssueDiv({number, title, body})
{
    var div = document.createElement("div"); 
    div.className = "container-fluid row"; 
    let content = document.createElement("div"); 
    content.className = "col-12 d-none"; 
    content.innerHTML = `<p>${body}</p>`; 

    function Header()
    {
        var header = document.createElement("div"); 
        header.className = "col-12 row"; 

        let id = document.createElement("div"); 
        id.className = "col-1"; 
        id.innerHTML = `<h3>${number}</h3>`; 

        let header_title = document.createElement("div"); 
        header_title.className = "col-10"; 
        header_title.innerHTML = `<a href="./issues.php?id=${number}"><h3>${title}</h3></a>`; 

        let show_hide = document.createElement("div"); 
        show_hide.className = "col-1"; 
        let button = document.createElement("button"); 
        button.className = "btn btn-light"; 
        button.setAttribute("data-show", "0"); 
        let icon = document.createElement("i"); 
        icon.className = "fas fa-plus"; 
        button.onclick = function()
        {
            let show = button.getAttribute("data-show"); 
            show = !Boolean(Number(show)); 
            if(show)
            {
                content.classList.remove("d-none"); 
            }
            else 
            {
                content.classList.add("d-none"); 
            }
            icon.className = `fas fa-${show?"minus": "plus"}`; 
            button.setAttribute("data-show", Number(show).toString()); 
        }
        button.appendChild(icon); 
        show_hide.appendChild(button); 

        header.append(id); 
        header.append(header_title); 
        header.append(show_hide); 
        return header; 
    }

    var header = Header(); 
    div.append(header); 
    div.append(content); 
    return div; 
}