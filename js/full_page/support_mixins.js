var support_mixin = 
{
    methods: 
    {
        AjaxRequest(url, data=new FormData(), type="get") 
        {
            var result = null; 
            $.ajax
            (
                {
                    type: type, 
                    url: url, 
                    data: data, 
                    async: false, 
                    contentType: false,
                    processData: false,
                    enctype: 'multipart/form-data',
                    success: function(success)
                    {
                        result = success; 
                    }, 
                    error: function(error)
                    {
                        console.log(error.responseText); 
                        console.log(error); 
                    }
                }
            ); 
            return result; 
        }, 
        TableData(overview_controller)
        {
            var data = this.AjaxRequest(`server/overview_controller/${overview_controller}.php?building_id=${this.BuildingId}`);

            try 
            {
               return JSON.parse(data); 
            }
            catch
            {
                return []; 
            }          
        }, 
        SpecialColumnsIndexes(action, supper_special=true)
        {
            try 
            {
                var special_columns = this.table_actions[action];
                var index_object = {}; 
                Object.keys(special_columns).forEach
                (   
                    element => 
                    {
                        if(supper_special)
                        {
                            index_object[(this.thead[element])?element:special_columns[element]] = this.thead[special_columns[element]]; 
                        }
                        else 
                        {
                            index_object[element] = this.thead[element]; 
                        }
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
            controller = (controller)?controller: this.StateObject('controller'); 
            var url = `server/import_controller/${controller}.php`; 
            return this.AjaxRequest(url, data, "post"); 
        }, 
        ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class=undefined)
        {
            based_classes.push((item_value==compared_value)?good_class: bad_class); 
            return based_classes; 
        }, 
        CapitalizeFirstWord(string)
        {
            return string[0].toUpperCase() +  string.slice(1); 
        }, 
        ValidObject(object)
        {
            return !(Object.values(object).includes(false));
        }, 
        StateObject(state_property)
        {
            return window.store_track.state[state_property]; 
        }
    }, 
    computed: 
    {
        BuildingId()
        {
            return window.store_track.state.building_id; 
        }, 
        StateController()
        {
            return window.store_track.state.controller; 
        }
    },
}; 

var edit_mixin = 
{
    mixins: [support_mixin], 
    mounted() 
    {
        if(this.edit_data)
        {
            this.value = this.edit_data[this.name]; 
        }    
    }
}; 

var simple_input_mixin = 
{
    mixins: [edit_mixin], 
    data()
    {
        return {
            value:""
        }
    } 
}