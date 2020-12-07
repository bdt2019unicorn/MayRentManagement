var general_utilities_mixin = 
{
    mixins: [support_mixin], 
    data: () =>({main_url: "server/utilities_controller/action.php?command="}), 
}

var utilities_mixin = 
{
    mixins: [general_utilities_mixin], 
    data: () =>
    (
        {
            select_data: 
            {
                utilities: [], 
                units: [], 
                select_value: "id", 
                text: "name", 
            }, 
            table_data: []
        }
    ), 
    created() 
    {
        this.SelectData(); 
    },

    methods: 
    {
        SelectData()
        {
            this.select_data.units = this.TableData("unit", {edit: 1});     
            let utility_data = this.AjaxRequest(`${this.main_url}SelectData`); 
            this.select_data.utilities = JSON.parse(utility_data); 
        }
    } 
}