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