function OverviewTable()
{
    $('#table-overview tfoot th').each
    ( 
        function () 
        {
            var title = $(this).text();
            if(!title.trim())
            {
                return; 
            }
            $(this).html('<input type="text" placeholder="Search '+title+'" />');
        } 
    );

    function SelectedData(table)
    {
        let rows = table.rows({selected: true}); 
        let count = rows.count(); 
        if(count)
        {
            var data = new Array(count); 
            let rows_data = rows.data(); 
            for (let index = 0; index < count; index++) 
            {
                data[index] = rows_data[index][1];                 
            }
            return data; 
        }
        else 
        {
            return undefined; 
        }
    }

    var table = $('#table-overview').DataTable
    (
        {
            columnDefs: 
            [ 
                {
                    orderable: false,
                    className: 'select-checkbox',
                    targets:   0
                } 
            ],
            scrollX: true, 
            scrollY: "70vh",
            scrollCollapse: true,
            paging: false,
            select: 
            {
                style: "multi"
            },
            dom: 'Blfrtip',
            buttons: 
            [
                'selectAll',
                'selectNone', 
                {
                    text: "Insert", 
                    action: function()
                    {
                        window.location.href = `./add-edit.php${window.location.search}`; 
                    }
                }, 
                {
                    text: "Edit", 
                    action: function()
                    {
                        var data = SelectedData(table); 
                        if(data)
                        {
                            console.log(data); 
                            var url_search_params = new URLSearchParams(window.location.search); 
                            url_search_params.set("ids", btoa(JSON.stringify(data))); 
                            console.log(url_search_params.toString()); 
                            window.location.href = `./add-edit.php?${url_search_params.toString()}`; 
                        }
                        else 
                        {
                            alert("There is nothing to edit. Please select some data"); 
                        }
                    }
                }, 
                {
                    text: "Delete", 
                    action: function()
                    {
                        var data = SelectedData(table); 
                        if(data)
                        {
                            let url = `../server/database_controller/delete.php${window.location.search}`; 
                            var result = support_mixin.methods.SubmitData("delete", url, data);
                            if(Number(result))
                            {
                                alert("Delete Data Success!"); 
                                window.location.reload(); 
                            }
                            else 
                            {
                                alert("Delete Data Fails! There seems like a server issue"); 
                            }
                        }
                        else
                        {
                            alert("There is nothing to delete. Please select some data"); 
                        }
                    }
                }
            ],
        }
    );

    table.columns().every 
    (
        function()
        {
            var that = this; 
            $('input', this.footer()).on
            (
                'keyup change', 
                function () 
                {
                    if (that.search() !== this.value) 
                    {
                        that.search(this.value).draw();
                    }
                } 
            );
        }
    ); 
}

function UserPermissions(id)
{
    var url = `../server/database_controller/edit.php?table=user&id=${id}`; 
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
        let url = "../server/admin_database.php?command=ChangeLogoImg"; 
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