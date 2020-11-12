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
                let surfix = "Edit "; 
                let controller = this.$route.params.controller; 

                let titles = "My Information"; 
                let object_id = this.StateObject("user_id"); 
                if(controller!="user")
                {
                    let data = this.AjaxRequest(`server/user_input_controller/${controller}.json`); 
                    object_id = this.$route.query.id; 
                    try 
                    {
                        titles = data.title; 
                    }
                    catch
                    {
                        titles = ""; 
                    }
                }
                return {
                    controller: controller, 
                    form_title: surfix + titles, 
                    object_id: object_id
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
        template: `<edit v-if="edit" v-bind="EditControllerBind"></edit>`
    } 
); 