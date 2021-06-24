function ChangeLogo() 
{
    var file_input = document.createElement("input"); 
    file_input.type = "file"; 
    file_input.accept = "image/*"; 
    file_input.click(); 
    file_input.onchange = function(event)
    {
        var file = file_input.files[0]; 
        var data = new FormData(); 
        data.append("file", file); 
        let url = AdminDatabaseUrl("ChangeLogoImg"); 
        var result = support_mixin.methods.AjaxRequest(url, data, "POST"); 
        if(result)
        {
            document.getElementById('logo_img').src = `../${result}?q=${Date.now()}`; 
        }
        else 
        {
            alert("Change logo image fails! Please try again"); 
        }
        
    }
}
function RunDbScripts()
{
    var text = $("#db_scripts_textarea").val().trim(); 
    var sql = text.split(";").map(string=>string.trim()).filter(string=>string); 
    if(!sql.length)
    {
        alert("Scripts are not valid!"); 
        return; 
    }
    let url = AdminDatabaseUrl("RunDbScripts"); 
    var result = support_mixin.methods.SubmitData("sql", url, sql); 
    if(Number(result))
    {
        alert("Scripts run successfully!"); 
        window.location.reload(); 
    }
    else 
    {
        alert("Scripts run fails. Please try again."); 
    }
}
function UserPermissions(id)
{
    var form = document.getElementById(`approve-user-${id}`); 
    var form_data = new FormData(form); 
    var data = Array.from(form_data.keys()).reduce((accumulator, current_value)=>({...accumulator, [current_value]: 1}), {approved: 1}); 
    var url = `../server/controller/database/edit.php?table=user&id=${id}`; 
    var result = support_mixin.methods.SubmitData("edit", url, data); 

    if(Number(result))
    {
        alert("User is approved!"); 
        window.location.reload(); 
    }
    else 
    {
        alert("User is not approved! There seems like a server error."); 
    }
}

class UserLog 
{
    static page_number = 0; 
    static UserLog(page)
    {
        $(".user-logs-pagnition nav ul li.active").removeClass("active"); 
        $(`.user-logs-pagnition nav ul li.user-log-page-${page}`).addClass("active"); 
        let url = AdminDatabaseUrl("UserLogFetch"); 
        var data = new FormData(); 
        data.append("page", page); 
        var logs = support_mixin.methods.AjaxRequest(url, data, "POST"); 
        try 
        {
            logs = JSON.parse(logs); 
        }
        catch 
        {
            logs = []; 
        }
        $("#user-logs").html 
        (
            logs.reduce
            (
                (accumulator, {id, action, tables, data, queries, username, modified_time}, current_index)=>
                `
                    ${accumulator}
                    <div class="card">
                        <div class="card-header">
                            <h2 class="mb-0">
                                <button class="btn btn-link w-100 text-left" type="button" data-toggle="collapse" data-target="#collapse-${current_index}" aria-expanded="true" aria-controls="collapse-${current_index}">
                                    <b>${action}</b>
                                </button>
                            </h2>
                            <p class="text-left"><code>#${id} done at ${modified_time} by ${username}</code></p>
                        </div>

                        <div id="collapse-${current_index}" class="collapse">
                            <div class="card-body text-left">
                                <h2><b>Tables: </b>${tables}</h2>
                                <div class="p-3 mb-2 mt-2 border border-primary">
                                    <h2>Data: </h2>
                                    <samp>${data}</samp>
                                </div>
                                <div class="p-3 mb-2 mt-2 border border-primary">
                                    <h2>Queries: </h2>
                                    <samp><pre style="white-space: break-spaces;">${queries}</pre></samp>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                `, ""
            ) 
        ); 
    }
    static UserLogActive(operation)
    {
        var active = $(".user-logs-pagnition nav ul li.active"); 
        var class_list = active.attr("class"); 
        class_list = class_list.split(" "); 
        const class_prefix = "user-log-page-"; 
        var class_page = class_list.find(class_name=>class_name.match(class_prefix)); 
        let page = class_page.replace(class_prefix, "").trim(); 
        eval(`page = Number(page) ${operation} 1`); 
        if(page>=1 && page <=this.page_number)
        {
            this.UserLog(page); 
        }
    }
    static UserLogCount()
    {
        let url = AdminDatabaseUrl("UserLogCount"); 
        let page_number = support_mixin.methods.AjaxRequest(url); 
        this.page_number = Number(page_number); 
        var list_html = ""; 
        for (let index = 1; index <= this.page_number; index++) 
        {
            list_html+=`<li class="page-item user-log-page-${index}"><a class="page-link" href="javascript:UserLog.UserLog(${index})">${index}</a></li>`; 
        }
        $(".user-logs-pagnition").html
        (
            `
                <nav>
                    <ul class="pagination justify-content-end">
                        <li class="page-item"><a class="btn btn-link" href="javascript:UserLog.UserLogActive('-')"><i class="fas fa-arrow-left"></i></a></li>
                        ${list_html}
                        <li class="page-item"><a class="btn btn-link" href="javascript:UserLog.UserLogActive('+')"><i class="fas fa-arrow-right"></i></a></li>
                    </ul>
                </nav>
            `
        ); 
    }
}