var user_input_components_mixin = 
{
    mixins: [support_mixin], 
    data()
    {
        return {
            value:""
        }
    }, 
    mounted() 
    {
        this.BringEditData(); 
    }, 
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
        $route: function(new_value, old_value)
        {
            this.value = ""; 
        }, 
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
}