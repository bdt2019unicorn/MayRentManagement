var general_edit = Vue.component
(
    "general-edit",
    {
        mixins: [support_mixin], 
        data()
        {
            return {
                edit: true 
            }; 
        }, 
        computed: 
        {
            EditControllerBind()
            {
                if(!this.edit)
                {
                    return undefined; 
                }
                let surfix = "Edit "; 
                let controller = this.$route.params.controller; 

                if(!controller)
                {
                    return undefined; 
                }

                let titles = "My Information"; 
                let object_id = this.StateObject("user_id"); 
                let user_input_json = undefined; 
                if(controller!="user")
                {
                    let data = this.AjaxRequest(`server/dashboard_controller/general_edit.php?controller=${controller}`); 
                    user_input_json = JSON.parse(data); 
                    object_id = this.$route.query.id; 
                    try 
                    {
                        titles = user_input_json.title; 
                    }
                    catch
                    {
                        titles = ""; 
                    }
                }
                return {
                    controller: controller, 
                    form_title: surfix + titles, 
                    object_id: object_id, 
                    user_input_json: user_input_json 
                }
            }    
        },
        watch: 
        {
            $route: function(to, from)
            {
                new Promise
                (
                    (resolve, reject)=>
                    {
                        this.edit = false; 
                        resolve(); 
                    }
                ).then 
                (
                    ()=>
                    {
                        this.edit = true; 
                    }
                ); 
            }    
        },
        template: `<edit v-if="EditControllerBind" v-bind="EditControllerBind"></edit>`
    } 
); 