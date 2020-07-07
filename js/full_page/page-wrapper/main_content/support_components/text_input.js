var text_mixin = 
{
    mixins: [simple_input_mixin], 
    watch: 
    {
        controller: function(new_value, old_value)
        {
            this.value = ""; 
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
                    v-model="value"
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
                <textarea class="form-control" :name="name" v-model="value">
                </textarea>
            </div>
        `
    }
); 