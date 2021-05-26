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
function UserLog(page)
{
    $(".user-logs-pagnition nav ul li.active").removeClass("active"); 
    $(`.user-logs-pagnition nav ul li.user-log-page-${page}`).addClass("active"); 
    let url = AdminDatabaseUrl("UserLogFetch"); 
    var data = new FormData(); 
    data.append("page", page); 
    var logs = support_mixin.methods.AjaxRequest(url, data, "POST"); 
    logs = JSON.parse(logs); 
    console.log(logs); 
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
                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse-${current_index}" aria-expanded="true" aria-controls="collapse-${current_index}">
                                ${id}
                            </button>
                        </h2>
                    </div>

                    <div id="collapse-${current_index}" class="collapse">
                        <div class="card-body">
                            ${queries}
                        </div>
                    </div>
                </div>
            `, ""
        ) 
    ); 
}
function UserLogCount()
{
    let url = AdminDatabaseUrl("UserLogCount"); 
    let page_number = support_mixin.methods.AjaxRequest(url); 
    var list_html = ""; 
    for (let index = 1; index <= Number(page_number); index++) 
    {
        list_html+=`<li class="page-item user-log-page-${index}"><a class="page-link" href="javascript:UserLog(${index})">${index}</a></li>`; 
    }
    $(".user-logs-pagnition").html
    (
        `
            <nav>
                <ul class="pagination justify-content-end">
                    <li class="page-item"><a class="btn btn-link" href="javascript:void()"><i class="fas fa-arrow-left"></i></a></li>
                    ${list_html}
                    <li class="page-item"><a class="btn btn-link" href="javascript:void()"><i class="fas fa-arrow-right"></i></a></li>
                </ul>
            </nav>
        `
    ); 
}
function UserPermissions(id)
{
    var url = `../server/controller/database/edit.php?table=user&id=${id}`; 
    var result = support_mixin.methods.SubmitData("edit", url, {approved: 1}); 
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