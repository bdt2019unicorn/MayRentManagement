var table_actions_mixin = 
{
    data: () =>({check_array: []}), 
    methods: 
    {
        ExcelSheet(table_data, hidden_columns=[])
        {
            let data = table_data.map 
            (
                row=>
                {
                    let modify = {}; 
                    Object.keys(row).filter(column=>!hidden_columns.includes(column)).forEach(column=>modify[column]=row[column]); 
                    return modify; 
                }
            ); 
            return XLSX.utils.json_to_sheet(data); 
        }, 
        IdCheckChanged: (selected_rows, filter_by)=>this.check_array = selected_rows.map(row=>row[filter_by])
    },

}