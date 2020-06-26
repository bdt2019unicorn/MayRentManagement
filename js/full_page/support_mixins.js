var support_mixin = 
{
    methods: 
    {
        TableData(overview_controller)
        {
            var url = "server/overview_controller/"+overview_controller+".php";
            var data = AjaxRequest(url);

            try 
            {
               return JSON.parse(data); 
            }
            catch
            {
                return []; 
            }          
        }, 
        ImportData(excel_data, controller=undefined)
        {
            var data = new FormData(); 
            data.append("excel",JSON.stringify(excel_data)); 
            controller = (controller)?controller: this.Controller; 
            var url = "server/import_controller/" + controller + ".php"; 
            return AjaxRequest(url, data, "post"); 
        }, 
        ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class=undefined)
        {
            based_classes.push((item_value==compared_value)?good_class: bad_class); 
            return based_classes; 
        }
    }, 
    computed: 
    {
        Username()
        {
            return window.store_track.state.username; 
        }, 
        BuildingId()
        {
            return window.store_track.state.building_id; 
        }, 
        Controller()
        {
            return window.store_track.state.controller; 
        }, 
        Action()
        {
            return window.store_track.state.action; 
        } 
    },
}