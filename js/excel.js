async function ReadExcel()
{
    var buffer = await file.arrayBuffer();
    var workbook = XLSX.read
    (
        buffer,
        {
            type: "array"
        }
    );
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var json_data = XLSX.utils.sheet_to_json
    (
        worksheet,
        {
            raw:true
        }
    );
    display_table.table_data = json_data; 
}

var file = null; 
jQuery
(
    function()
    {
        $("#excel_input").change 
        (
            function(event)
            {
                file = event.target.files[0]; 
            }
        ); 
    }
); 


function SendData()
{
    var data = new FormData(); 
    data.append("excel",JSON.stringify(display_table.table_data)); 
    var url = "server/server.php"; 
    var result = AjaxRequest(url, data, "post"); 
    console.log(result); 
}