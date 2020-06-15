var overview_component = Vue.component 
(
    "overview-component", 
    {
        template: 
        `
            <div class="row">
                <div class="col-1"></div>
                <scrolling-table></scrolling-table>
                <div class="col-1"></div>
            </div>
        `
    }
); 