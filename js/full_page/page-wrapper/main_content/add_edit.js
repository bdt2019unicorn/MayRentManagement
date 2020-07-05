var add_edit_mixin = 
{
    mixins: [support_mixin], 
    computed: 
    {
        FormId()
        {
            return (this.object_id)?`${this.CurrentController}_id_${this.object_id}`:this.CurrentController; 
        }, 
        CurrentController()
        {
            return ((this.controller)?this.controller:this.StateController); 
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
        }, 
        SubmitData(url, data)
        {
            var form_data = new FormData(); 
            form_data.append("edit", JSON.stringify(data)); 
            return this.AjaxRequest(url,form_data, "post");
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
            :id="FormId"
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
        methods: 
        {
            SubmitForm(data)
            {
                let result = this.ImportData([data], this.controller); 
                if(Number(result))
                {
                    alert(this.title+" Success!"); 
                    $(`#${this.FormId}`).trigger("reset"); 
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
        },
        created() 
        {
            this.PopulateFormField(); 
        },
    }
); 



Vue.component
(
    "edit", 
    {
        props: ["object_id", "form_title"], 
        mixins: [add_edit_mixin], 
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
            SubmitForm(data)
            {
                var url = `server/edit_controller/${this.CurrentController}.php?id=${this.object_id}`; 
                var result = this.SubmitData(url,data); 
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
        },
        created() 
        {
            this.PopulateFormField(); 
            this.ModifyForm(); 
        },
        mounted() 
        {
            var data = this.AjaxRequest(`server/overview_controller/${this.CurrentController}.php?id=${this.object_id}`);    
            console.log(data); 
            data = JSON.parse(data); 
            Object.keys(data).forEach
            (
                property=>
                {
                    var input = $(`#${this.FormId}`).find(`[name="${property}"]`); 
                    $(input).val(data[property]); 
                    if($(input).attr("type")=="checkbox")
                    {
                        $(input).attr("checked", data[property]); 
                    }
                }
            ); 
        }
    }
); 