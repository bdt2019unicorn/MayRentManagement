var add_edit_mixin = 
{
    mixins: [support_mixin], 
    computed: 
    {
        CurrentController()
        {
            return ((this.controller)?this.controller:this.StateObject('controller')); 
        }
    },
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
    template: 
    `
        <user-input 
            v-bind="$data" 
            :id="CurrentController"
            :edit_data="(this.edit_data)?this.edit_data:undefined"
            @form-information-valid="SubmitForm"
        ></user-input>
    `
}



Vue.component
(
    "add", 
    {
        props: ["controller"], 
        mixins: [add_edit_mixin], 
        data()
        {
            return {
                title: "Add ",
                form: [], 
                validate: {} 
            }
        }, 
        created() 
        {
            this.PopulateFormField(); 
        }, 
        methods: 
        {
            SubmitForm(data)
            {
                let result = this.ImportData([data], this.controller); 
                if(Number(result))
                {
                    alert(this.title+" Success!"); 
                    $(`#${this.CurrentController}`).trigger("reset"); 
                    if(this.controller)
                    {
                        data["user_id"] = Number(result); 
                        this.$emit("authorize-controller-success", this.controller, data); 
                        return; 
                    }
                    window.location.reload(); 
                }
                else
                {
                    alert(this.title+" Fails, please try again!"); 
                }
            }    
        }
    }
); 



Vue.component
(
    "edit", 
    {
        props: ["form_title", "object_id"], 
        mixins: [add_edit_mixin], 
        data()
        {
            return {
                title: "Edit ",
                form: [], 
                validate: {}, 
                edit_data: undefined
            }
        }, 
        created() 
        {
            this.PopulateFormField(); 
            this.ModifyForm(); 
            this.PopulateDateIntoFields(); 
        }, 
        methods: 
        {
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
            }, 
            PopulateDateIntoFields()
            {
                var data = this.AjaxRequest(`server/overview_controller/${this.CurrentController}.php?id=${this.object_id}`);    
                this.edit_data = JSON.parse(data)[0];  
                Object.keys(this.edit_data).forEach
                (
                    property=>
                    {
                        this.edit_data[property.toLowerCase()] = this.edit_data[property]; 
                    }
                ); 
            }, 
            SubmitForm(data)
            {
                var url = `server/edit_controller/${this.CurrentController}.php?id=${this.object_id}`; 
                var result = this.SubmitData("edit",url,data); 
                if(Number(result))
                {
                    alert("Edit Information success"); 
                    window.location.reload();
                }
                else
                {
                    alert("Edit Information fails"); 
                }
            }
        }
    }
); 