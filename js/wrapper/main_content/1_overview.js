var overview_component = Vue.component 
(
    "Overview", 
    {
        template: 
        `
            <div class="row">
                <div class="col-1"></div>
                <scrolling-table
                    extra_class="col-10"
                >
                </scrolling-table>
                <div class="col-1"></div>
            </div>
        `
    }
); 