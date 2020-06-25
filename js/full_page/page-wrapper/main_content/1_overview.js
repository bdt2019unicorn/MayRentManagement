var overview_component = Vue.component 
(
    "Overview", 
    {
        mixins:[overview_data_mixins], 
        computed: 
        {
            OverviewController()
            {
                return window.store_track.state.controller; 
            }   
        },
        template: 
        `
            <div class="row">
                <div class="col-1"></div>
                <scrolling-table
                    extra_class="col-10"
                    :table_data="TableData(OverviewController)"
                >
                </scrolling-table>
                <div class="col-1"></div>
            </div>
        `
    }
); 