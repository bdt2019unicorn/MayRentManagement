var overview_component = Vue.component 
(
    "Overview", 
    {
        computed: 
        {
            TableData()
            {
                var url = "server/overview_controller/"+window.store_track.state.controller+".php";
                var data = AjaxRequest(url);
    
                try 
                {
                   return JSON.parse(data); 
                }
                catch
                {
                    return []; 
                }          
            }   
        },

        template: 
        `
            <div class="row">
                <div class="col-1"></div>
                <scrolling-table
                    extra_class="col-10"
                    :table_data="TableData"
                >
                </scrolling-table>
                <div class="col-1"></div>
            </div>
        `
    }
); 