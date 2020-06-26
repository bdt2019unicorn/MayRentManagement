var overview_component = Vue.component 
(
    "Overview", 
    {
        mixins:[support_mixin], 
        template: 
        `
            <div class="row">
                <div class="col-1"></div>
                <scrolling-table
                    extra_class="col-10"
                    :table_data="TableData(Controller)"
                >
                </scrolling-table>
                <div class="col-1"></div>
            </div>
        `
    }
); 