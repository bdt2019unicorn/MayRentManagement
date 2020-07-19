var support_mixin = 
{
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
        TableActions(controller)
        {
            var table_actions = this.AjaxRequest(`server/overview_controller/table_actions/${controller}.json`);
            return (table_actions)?table_actions:{}; 
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
        ValidObject(object)
        {
            return !(Object.values(object).includes(false));
        }, 
        StateObject(state_property)
        {
            return window.store_track.state[state_property]; 
        }, 
        SubmitData(key, url, data)
        {
            var form_data = new FormData(); 
            form_data.append(key, JSON.stringify(data)); 
            return this.AjaxRequest(url,form_data, "post");
        }
    } 
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