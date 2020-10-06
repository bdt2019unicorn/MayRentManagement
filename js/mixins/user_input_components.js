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
        BringEditData(callback=undefined)
        {
            if(this.edit_data)
            {
                this.value = this.edit_data[this.name]; 
            }   
            eval(callback);  
        }    
    },
    watch: 
    {
        $attrs: function(new_value, old_value)
        {
            if(new_value.value!=old_value.value)
            {
                this.value = new_value.value; 
            }
        }, 
        $route: function(new_value, old_value)
        {
            this.value = ""; 
        }, 
        value: function(new_value, old_value)
        {
            this.$emit("input", new_value); 
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
    mixins: [user_input_components_mixin], 
    mounted()
    {
        let callback = 
        `
            else if(this.$attrs.value!=undefined)
            {
                this.value = this.$attrs.value; 
            }
        `; 
        this.BringEditData(callback); 
    }, 
    watch: 
    {
        $attrs: function(new_value, old_value)
        {
            if(new_value.value!=old_value.value)
            {
                this.value = new_value.value; 
            }
        }
    }
}