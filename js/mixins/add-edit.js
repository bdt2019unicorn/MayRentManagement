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
            var data = this.$attrs.user_input_json || this.AjaxRequest(`server/user_input_controller/${this.CurrentController}.json`); 
            try 
            {
                this.form = data.form; 
                this.title = this.form_title || (this.controller? data.title :this.title_surfix+data.title); 
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
            this.ReloadUserInput(this.PopulateFormField); 
        }, 
        controller: function(new_value, old_value)
        {
            this.ReloadUserInput(this.PopulateFormField); 
        }    
    },

    template: `<user-input v-if="user_input" v-bind="$data" :edit_data="this.edit_data?this.edit_data:undefined" @form-information-valid="SubmitForm"></user-input>`
}