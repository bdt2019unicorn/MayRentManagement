var support_mixin = 
{
    computed: 
    {
        BuildingId()
        {
            return window.store_track.state.building_id; 
        }, 
        CurrentController()
        {
            return ((this.controller)?this.controller:this.StateController); 
        }, 
        ImportUrl()
        {
            return `server/import_controller/${this.CurrentController}.php`; 
        }, 
        OverviewUrl()
        {
            return this.OverviewDataUrl(this.CurrentController) + ((this.object_id)?`&id=${this.object_id}`: ""); 
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
        ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class=undefined)
        {
            based_classes.push((item_value==compared_value)?good_class: bad_class); 
            return based_classes; 
        }, 
        OverviewDataUrl(overview_controller)
        {
            return `server/overview_controller/${overview_controller}.php?building_id=${this.BuildingId}`; 
        }, 
        StateObject(state_property)
        {
            return window.store_track.state[state_property]; 
        }, 
        SubmitData(key, url, data, stringify=true)
        {
            var form_data = new FormData(); 
            form_data.append(key, (stringify)?JSON.stringify(data): data); 
            return this.AjaxRequest(url,form_data, "post");
        },
        TableActions(controller)
        {
            var table_actions = this.AjaxRequest(`server/overview_controller/table_actions/${controller}.json`);
            return (table_actions)?table_actions:{}; 
        }, 
        TableData(overview_controller)
        {
            var data = this.AjaxRequest(this.OverviewDataUrl(overview_controller));

            try 
            {
               return JSON.parse(data); 
            }
            catch
            {
                return []; 
            }          
        }, 
        ValidObject(object)
        {
            return !(Object.values(object).includes(false));
        }
    } 
}; 

var edit_mixin = 
{
    mixins: [support_mixin], 
    mounted() 
    {
        this.BringEditData(); 
    }, 
    methods: 
    {
        BringEditData()
        {
            if(this.edit_data)
            {
                this.value = this.edit_data[this.name]; 
            }    
        }    
    },
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

var text_mixin = 
{
    mixins: [simple_input_mixin], 
    watch: 
    {
        controller: function(new_value, old_value)
        {
            this.value = ""; 
        }
    }, 
}

var add_edit_mixin = 
{
    mixins: [support_mixin], 
    methods: 
    {
        PopulateFormField()
        {
            var data = this.AjaxRequest(`server/user_input_controller/${this.CurrentController}.json`); 
            try 
            {
                this.form = data.form; 
                this.title = (this.form_title)?this.form_title: (this.controller)? data.title :this.title+data.title; 
                this.validate = (data.validate)?data.validate:this.validate; 
            } 
            catch
            {
                this.form = []; 
                this.title ="Edit "; 
            }
        }
    },
    watch: 
    {
        CurrentController: function(new_value, old_value)
        {
            this.PopulateFormField(); 
        }   
    },
    template: `<user-input v-bind="$data" :id="CurrentController" :edit_data="(this.edit_data)?this.edit_data:undefined" @form-information-valid="SubmitForm"></user-input>`
}

var utilities_mixin = 
{
    mixins: [support_mixin], 
    data() 
    {
        return {
            main_url: "server/utilities_controller/utility_overview.php?command=", 
            select_data: 
            {
                utilities: [], 
                apartments: [], 
                select_value: "id", 
                text: "name", 
            }, 
            table_data: []
        }
    }, 
    created() 
    {
        this.SelectData(); 
    },

    methods: 
    {
        SelectData()
        {
            let utility_data = this.AjaxRequest(`${this.main_url}SelectData`); 
            this.select_data.utilities = JSON.parse(utility_data); 
        }
    },
}