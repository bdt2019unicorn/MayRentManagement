async function ReadExcel()
{
    var file = document.getElementById('excel_input').files[0]; 
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
            raw:false
        }
    );
    display_table.table_data = json_data; 
}

function SendData()
{
    var data = new FormData(); 
    data.append("excel",JSON.stringify(display_table.table_data)); 
    // var url = "server/server.php"; 
    var url = "server/controller/revenue.php"; 
    var result = AjaxRequest(url, data, "post"); 
    if(result==true)
    {
        alert("goood"); 
    }    

    console.log(result); 
}