var general_edit = Vue.component
(
    "general-edit",
    {
        mixins: [support_mixin], 
        data: ()=> ({edit: true}), 
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
                    let data = (controller=="buildings")? this.StateObject("building_user_input") : this.AjaxRequest(`server/dashboard_controller/general_edit.php?controller=${controller}`); 
                    user_input_json = (controller=="buildings")? data: JSON.parse(data); 
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
                this.ResetValue({value_name: "edit", new_value: true}); 
                // new Promise
                // (
                //     (resolve, reject)=>
                //     {
                //         this.edit = false; 
                //         resolve(); 
                //     }
                // ).then 
                // (
                //     ()=>
                //     {
                //         this.edit = true; 
                //     }
                // ); 
            }    
        },
        template: `<edit v-if="EditControllerBind" v-bind="EditControllerBind" @edit-building-success="BuildingsData"></edit>`
    } 
); 