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
    var json_data = XLSX.utils.sheet_to_json(worksheet,{raw:true}); 
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