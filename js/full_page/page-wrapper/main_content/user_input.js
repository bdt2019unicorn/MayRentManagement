Vue.component
(
    "user-input-test", 
    {
        props: ["title","form", "validate"], 
        mixins: [support_mixin], 
        data()
        {
            return {
                just_started_parent: false,  
                row_valid: {}
            }
        }, 
        methods: 
        {        
            PopulateFormValidation()
            {
                $(this.$refs["action_form"]).trigger("reset"); 
                $(this.$refs["action_form"]).validate().destroy(); 
                $(this.$refs["action_form"]).validate(this.validate); 
            }, 
            FormValid()
            {
                return (
                    $(this.$refs["action_form"]).valid() && 
                    this.ValidObject(this.row_valid)
                ); 
            }, 
            RowGroupValidation(index, validation)
            {
                this.row_valid[index] = validation; 
            }, 
            SubmitForm(event)
            {
                this.just_started_parent = true; 
                if(!this.FormValid())
                {
                    return; 
                }
                let data = $(event.target).serializeObject(); 
                console.log(data); 
                // let result = this.ImportData([data], this.controller); 
                // if(result==true)
                // {
                //     alert(this.title+" Success!"); 
                //     $(this.$refs["action_form"]).trigger("reset"); 
                //     if(this.controller)
                //     {
                //         this.$emit("valid-controller-success", this.controller, data); 
                //         return; 
                //     }
                //     window.location.reload(); 
                // }
                // else
                // {
                //     alert(this.title+" Fails, please try again!"); 
                // }
            }
        },

        watch: 
        {
            title: function(new_value, old_value)
            {
                this.PopulateFormValidation(); 
            }   
        },

        mounted()
        {
            this.PopulateFormValidation(); 
        }, 

        template: 
        `
            <form 
                class="container-fluid"
                @submit.prevent="SubmitForm"
                ref="action_form"
            >
                <h1 style="text-align: center;">{{title}}</h1>
                <template v-for="(row, index) in form">
                    <br>
                    <row-group
                        :row="row"
                        :just_started_parent= "just_started_parent"
                        :controller="StateController"
                        :index="index"
                        :key="index"
                        @row-group-validation="RowGroupValidation"
                    >
                    </row-group>
                </template>
            
                <br>
                <div class="row">
                    <div class="form-group col-2">
                        <button type="reset" class="btn" title="Clear">
                            <i style="font-size: xx-large;" class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="form-group col-8">
                    </div>
                    <div class="form-group col-2">
                        <button type="submit" class="btn" :title="title">
                            <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                        </button>
                    </div>
                </div>

            </form>
        `
    }
); 










Vue.component
(
    "user-input", 
    {
        props: ["controller"], 
        mixins: [support_mixin], 
        data()
        {
            return {
                title: "Add ",
                just_started_parent: false,  
                form: [], 
                validate: {}, 
                row_valid: {}
            }
        }, 
        computed: 
        {
            CurrentController()
            {
                return ((this.controller)?this.controller:this.StateController); 
            }
        },
        methods: 
        {        
            PopulateFormData()
            {
                var data = this.AjaxRequest(`server/user_input_controller/${this.CurrentController}.json`); 
                try 
                {
                    this.form = data.form; 
                    this.title = (this.controller)?data.title: this.title+data.title; 
                    this.validate = (data.validate)?data.validate:this.validate; 
                } 
                catch
                {
                    this.form = []; 
                    this.title ="Add "; 
                }
            }, 
            PopulateFormValidation()
            {
                $(this.$refs["action_form"]).trigger("reset"); 
                $(this.$refs["action_form"]).validate().destroy(); 
                $(this.$refs["action_form"]).validate(this.validate); 
            }, 
            FormValid()
            {
                return (
                    $(this.$refs["action_form"]).valid() && 
                    this.ValidObject(this.row_valid)
                ); 
            }, 
            RowGroupValidation(index, validation)
            {
                this.row_valid[index] = validation; 
            }, 
            SubmitForm(event)
            {
                this.just_started_parent = true; 
                if(!this.FormValid())
                {
                    return; 
                }
                let data = $(event.target).serializeObject(); 
                let result = this.ImportData([data], this.controller); 
                if(Number(result))
                {
                    alert(this.title+" Success!"); 
                    $(this.$refs["action_form"]).trigger("reset"); 
                    if(this.controller)
                    {
                        data["user_id"] = Number(result); 
                        this.$emit("valid-controller-success", this.controller, data); 
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

        watch: 
        {
            CurrentController: function(new_value, old_value)
            {
                this.PopulateFormData(); 
                this.PopulateFormValidation(); 
            }   
        },

        mounted()
        {
            this.PopulateFormValidation(); 
        }, 

        created() 
        {
            this.PopulateFormData(); 
        },

        template: 
        `
            <form 
                class="container-fluid"
                @submit.prevent="SubmitForm"
                ref="action_form"
            >
                <h1 style="text-align: center;">{{title}}</h1>
                <template v-for="(row, index) in form">
                    <br>
                    <row-group
                        :row="row"
                        :just_started_parent= "just_started_parent"
                        :controller="CurrentController"
                        :index="index"
                        :key="index"
                        @row-group-validation="RowGroupValidation"
                    >
                    </row-group>
                </template>
            
                <br>
                <div class="row">
                    <div class="form-group col-2">
                        <button type="reset" class="btn" title="Clear">
                            <i style="font-size: xx-large;" class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="form-group col-8">
                    </div>
                    <div class="form-group col-2">
                        <button type="submit" class="btn" :title="title">
                            <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                        </button>
                    </div>
                </div>

            </form>
        `
    }
); 