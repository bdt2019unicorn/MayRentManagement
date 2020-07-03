var support_mixin = 
{
    methods: 
    {
        TableData(overview_controller)
        {
            var url = `server/overview_controller/${overview_controller}.php?building_id=${this.BuildingId}`;
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
        SpecialColumnsIndexes(action)
        {
            try 
            {
                var special_columns = this.table_actions[action];
                var index_object = {}; 
                Object.keys(special_columns).forEach
                (   
                    element => 
                    {
                        index_object[(this.thead[element])?element:special_columns[element]] = this.thead[special_columns[element]]; 
                    }
                );
                return index_object; 
            }
            catch
            {
                return {}; 
            }
        }, 
        ImportData(excel_data, controller=undefined)
        {
            var data = new FormData(); 
            data.append("excel",JSON.stringify(excel_data)); 
            controller = (controller)?controller: this.StateController; 
            var url = `server/import_controller/${controller}.php`; 
            return AjaxRequest(url, data, "post"); 
        }, 
        ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class=undefined)
        {
            based_classes.push((item_value==compared_value)?good_class: bad_class); 
            return based_classes; 
        }, 
        CapitalizeFirstWord(string)
        {
            return string[0].toUpperCase() +  string.slice(1); 
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
        StateController()
        {
            return window.store_track.state.controller; 
        }, 
        StateAction()
        {
            return window.store_track.state.action; 
        } 
    },
}