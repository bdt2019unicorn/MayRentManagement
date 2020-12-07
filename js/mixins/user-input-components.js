var user_input_support_mixin = 
{
    props: ["edit_data", "lock", "name", "title"], 
    mixins: [support_mixin], 
}

var user_input_components_mixin = 
{
    mixins: [user_input_support_mixin], 
    data: ()=>({value:""}), 
    mounted: ()=> this.BringEditData(), 
    methods: 
    {
        BringEditData()
        {
            if(this.edit_data)
            {
                this.value = this.edit_data[this.name]; 
            }   
        }    
    },
    watch: 
    {
        $route: (new_value, old_value)=>this.value = "", 
        value: function(new_value, old_value)
        {
            if(this.edit_data)
            {
                if(this.edit_data[this.name]!=new_value)
                {
                    this.$emit("new-value-change-valid", this.edit_data, this.name, new_value, true); 
                }
            }
        }
    }
}; 

var user_input_components_v_model_support_mixin = 
{
    props: ["value"], 
    mixins: [user_input_support_mixin], 
    data: () =>({content: this.value}), 
    methods: 
    {
        BringEditData()
        {
            if(this.edit_data)
            {
                this.content = this.edit_data[this.name]; 
                this.$emit("input", this.content); 
            }
        }    
    },
    mounted: () =>this.BringEditData(), 
    watch: 
    {
        content: (new_value, old_value)=> this.$emit("input", new_value),
        value: (new_value, old_value)=> this.content = new_value 
    } 
}