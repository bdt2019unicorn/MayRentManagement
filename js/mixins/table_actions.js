var table_actions_mixin = 
{
    data() 
    {
        return {
            check_array: [] 
        }
    },

    methods: 
    {
        IdCheckChanged(selected_rows, filter_by)
        {
            this.check_array = selected_rows.map(row=>row[filter_by]); 
        },     
    },

}