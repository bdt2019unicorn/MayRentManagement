Vue.component
(
    "add", 
    {
        mixins: [add_edit_mixin], 
        data()
        {
            return {
                title_surfix: "Add "
            }
        }, 
        methods: 
        {
            SubmitForm(data)
            {
                let result = this.SubmitData("excel", this.ImportUrl,[data]); 
                if(Number(result))
                {
                    alert(`${this.title} Success!`); 
                    if(this.controller)
                    {
                        data["user_id"] = Number(result); 
                        this.$emit("authorize-controller-success", this.controller, data); 
                        return; 
                    }
                    this.ReloadUserInput(); 
                }
                else
                {
                    alert(`${this.title} Fails, please try again!`); 
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
                title_surfix: "Edit ",
                edit_data: undefined
            }
        }, 
        created() 
        {
            this.ModifyForm(); 
            this.PopulateDataIntoFields(); 
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
            PopulateDataIntoFields()
            {
                let data = this.TableData(this.CurrentController, {id: this.ObjectId, edit: 1}); 
                this.edit_data = data[0];  
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
                var url = `server/database_controller/edit.php?table=${this.CurrentController}&id=${this.ObjectId}`; 
                var result = this.SubmitData("edit",url,data); 

                if(Number(result))
                {
                    alert("Edit Information success"); 
                    if(this.controller=="buildings")
                    {
                        this.$emit("edit-building-success"); 
                    }
                    this.ReloadUserInput(this.PopulateDataIntoFields); 
                }
                else
                {
                    alert("Edit Information fails"); 
                }
            }
        }
    }
); 