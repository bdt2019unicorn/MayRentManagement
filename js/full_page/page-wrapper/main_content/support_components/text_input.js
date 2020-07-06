var text_mixin = 
{
    data()
    {
        return {
            input_value:""
        }
    }, 
    mixins: [support_mixin], 
    mounted() 
    {
        if(this.edit_data)
        {
            this.input_value = this.edit_data[this.name]; 
        }    
    },
    watch: 
    {
        controller: function(new_value, old_value)
        {
            this.input_value = ""; 
        }
    }, 
}

Vue.component
(
    "text-input", 
    {
        props: ["name", "title", "type", "id", "controller", "edit_data"], 
        mixins: [text_mixin], 
        computed: 
        {
            InputType()
            {
                return (this.type)?this.type: "text"; 
            }
        }, 
        template: 
        `
            <div class="form-group col">
                <label :for="name" v-if="title"><b>{{title}}</b></label>
                <input 
                    class="form-control"
                    :type="InputType"  
                    :name="name" 
                    :id="id"
                    v-model="input_value"
                >
            </div>
        `
    }
); 

Vue.component
(
    "text-group-confirmation", 
    {
        props: ["name", "title", "id", "confirm_name", "confirm_title"], 
        template: 
        `
            <div class="form-group col">
                <div class="row">
                    <text-input
                        :name="name"
                        :title="title"
                        :id="id"
                    >
                    </text-input>

                    <text-input
                        :name="confirm_name"
                        :title="confirm_title"
                    >
                    </text-input>
                </div>
            </div>
        `
    }
); 

Vue.component
(
    "textarea-input", 
    {
        props: ["name", "title", "controller", "edit_data"],
        mixins: [text_mixin],  
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <textarea class="form-control" :name="name">
                </textarea>
            </div>
        `
    }
); 