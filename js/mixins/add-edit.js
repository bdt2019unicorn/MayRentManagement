var add_edit_mixin = 
{
    props: ["controller"], 
    mixins: [support_mixin], 
    data: ()=>
    (
        {
            title: "", 
            form: [], 
            user_input: true, 
            validate: {} 
        }
    ), 
    created() 
    {
        this.PopulateFormField(); 
    }, 
    methods: 
    {
        PopulateFormField()
        {
            var data = this.$attrs.user_input_json || this.AjaxRequest(`server/user_input_controller/en/${this.CurrentController}.json`); 
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
        ReloadUserInput(callback_resolve=undefined)
        {
            this.ResetValue({value_name: "user_input", new_value: true, callback_resolve}); 
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

    template: `<user-input v-if="user_input" v-bind="$data" :edit_data="this.edit_data" @form-information-valid="SubmitForm"></user-input>`
}