Vue.component
(
    "add", 
    {
        props: ["controller"], 
        mixins: [support_mixin], 
        data()
        {
            return {
                title: "Add ",
                form: [], 
                validate: {} 
            }
        }, 
        template: 
        `

        `
    }
); 



Vue.component
(
    "edit", 
    {
        props: ["object_id", "form_title"], 
        mixins: [support_mixin], 
        data()
        {
            return {
                title: "Edit ",
                form: [], 
                validate: {} 
            }
        }, 
        methods: 
        {
            PopulateFormField()
            {
                var data = this.AjaxRequest(`server/user_input_controller/${this.StateController}.json`); 
                try 
                {
                    this.form = data.form; 
                    this.title = (this.form_title)?this.form_title: this.title+data.title; 
                    this.validate = (data.validate)?data.validate:this.validate; 
                } 
                catch
                {
                    this.form = []; 
                    this.title ="Edit "; 
                }
            }, 
            ModifyForm()
            {
                for(var row of this.form)
                {
                    for(var i=0; i<row.length; i++)
                    {
                        if(row[i].component=="text-group-confirmation")
                        {
                            row[i].component = "text-input"; 
                            delete this.validate[row[i]["confirm_name"]]; 
                        }
                        if(row[i]["type"]=="password")
                        {
                            delete row[i]["type"]; 
                        }
                    }
                }
            }
        },
        created() 
        {
            this.PopulateFormField(); 
            this.ModifyForm(); 
        },
        mounted() 
        {
            var data = this.AjaxRequest(`server/overview_controller/${this.StateController}.php?id=${this.object_id}`);    
            data = JSON.parse(data); 
            Object.keys(data).forEach
            (
                property=>
                {
                    var input = $(`#${this.StateController}_id_${this.object_id}`).find(`[name="${property}"]`); 
                    $(input).val(data[property]); 
                    if($(input).attr("type")=="checkbox")
                    {
                        $(input).attr("checked", data[property]); 
                    }
                }
            ); 
        },
        watch: 
        {
            StateController: function(new_value, old_value)
            {
                this.PopulateFormData(); 
            }   
        },
        template: 
        `
            <user-input-test v-bind="$data" :id="StateController+'_id_'+object_id"></user-input-test>

        `
    }
); 