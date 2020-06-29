var overview_component = Vue.component 
(
    "Overview", 
    {
        mixins:[support_mixin], 
        methods: 
        {
            TableActions(controller)
            {
                return AjaxRequest(`server/overview_controller/table_actions/${controller}.json`);
            }
        },
        template: 
        `
            <div>
                <h1>{{CapitalizeFirstWord(StateController)}}</h1>

                <scrolling-table
                    :table_data="TableData(StateController)"
                    :table_actions="TableActions(StateController)"
                >
                </scrolling-table>
            </div>
        `
    }
); 