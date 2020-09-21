var support_mixin = 
{
    computed: 
    {
        CurrentController()
        {
            return this.controller || this.$route.params.controller || "overview"; 
        }, 
        ImportUrl()
        {
            return `server/database_controller/import.php?import_controller=${this.CurrentController}`; 
        }, 
        ObjectId()
        {
            return this.object_id || this.$route.query.id; 
        }, 
        OverviewUrl()
        {
            return this.OverviewDataUrl(this.CurrentController, {id: this.ObjectId}); 
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

        DateReformat(string=undefined)
        {
            return string?moment(string):moment(); 
        }, 

        DateReformatDatabase(string=undefined)
        {
            return this.DateReformat(string).format("YYYY-MM-DD"); 
        }, 

        DateReformatDisplay(string=undefined)
        {
            return this.DateReformat(string).format("DD MMM YYYY"); 
        }, 

        ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class=undefined)
        {
            based_classes.push((item_value==compared_value)?good_class: bad_class); 
            return based_classes; 
        }, 
        OverviewDataUrl(overview_controller, params=undefined)
        {
            params = 
            {
                building_id: this.$route.params.building_id, 
                overview_controller: overview_controller, 
                ...params
            }

            let search = Object.keys(params).filter(key=>params[key]!=undefined).map(key=>`${key}=${params[key]}`).join("&"); 
            return `server/overview_controller/overview_controller.php?${search}`; 
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
            return table_actions || {}; 
        }, 
        TableData(overview_controller, params=undefined)
        {
            var data = this.AjaxRequest(this.OverviewDataUrl(overview_controller, params));
            try 
            {
               return JSON.parse(data); 
            }
            catch
            {
                return []; 
            }          
        }, 
        ToActions({controller=undefined, action, query=undefined})
        {
            return {
                name: "actions", 
                params: 
                {
                    building_id: this.$route.params.building_id, 
                    controller: controller || this.CurrentController, 
                    action: action
                }, 
                query: query
            }; 
        }, 
        ValidObject(object)
        {
            return !(Object.values(object).includes(false));
        }
    } 
}; 

var user_input_components_mixin = 
{
    mixins: [support_mixin], 
    data()
    {
        return {
            value:""
        }
    }, 
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
    watch: 
    {
        $route: function(new_value, old_value)
        {
            this.value = ""; 
        }, 
        value: function(new_value, old_value)
        {
            if(this.edit_data)
            {
                if(this.edit_data[this.name]!=new_value)
                {
                    this.$emit("new-value-change-valid", this.edit_data, this.name, new_value, true); 
                }
            }
        }
    }
}

var add_edit_mixin = 
{
    props: ["controller"], 
    mixins: [support_mixin], 
    data()
    {
        return {
            title: "", 
            form: [], 
            user_input: true, 
            validate: {} 
        }
    }, 
    created() 
    {
        this.PopulateFormField(); 
    }, 
    methods: 
    {
        PopulateFormField()
        {
            var data = this.AjaxRequest(`server/user_input_controller/${this.CurrentController}.json`); 
            try 
            {
                this.form = data.form; 
                this.title = this.form_title || this.controller? data.title :this.title_surfix+data.title; 
                this.validate = data.validate || this.validate; 
            } 
            catch
            {
                this.form = []; 
                this.title =""; 
            }
        }, 
        ReloadUserInput(callback=undefined)
        {
            new Promise 
            (
                (resolve, reject)=>
                {
                    this.user_input = false;
                    resolve(callback);  
                }
            ).then 
            (
                (callback)=>
                {
                    if(callback)
                    {
                        callback(); 
                    }
                    this.user_input = true; 
                }
            ); 
        }
    },
    watch: 
    {
        $route: function(new_value, old_value)
        {
            this.PopulateFormField(); 
        }, 
        controller: function(new_value, old_value)
        {
            this.PopulateFormField(); 
        }    
    },

    template: `<user-input v-if="user_input" v-bind="$data" :edit_data="this.edit_data?this.edit_data:undefined" @form-information-valid="SubmitForm"></user-input>`
}

var utilities_mixin = 
{
    mixins: [support_mixin], 
    data() 
    {
        return {
            main_url: "server/utilities_controller/action.php?command=", 
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
            this.select_data.apartments = this.TableData("apartment", {edit: 1});     
            let utility_data = this.AjaxRequest(`${this.main_url}SelectData`); 
            this.select_data.utilities = JSON.parse(utility_data); 
        }
    },
}