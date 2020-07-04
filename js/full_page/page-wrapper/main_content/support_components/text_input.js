Vue.component
(
    "text-input", 
    {
        props: ["name", "title", "type", "id", "controller"], 
        data()
        {
            return {
                input_value:""
            }
        }, 
        mixins: [support_mixin], 
        computed: 
        {
            InputType()
            {
                return (!this.type)?"text":this.type; 
            }
        }, 
        watch: 
        {
            controller: function(new_value, old_value)
            {
                this.input_value = ""; 
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
        computed: 
        {
            InputType()
            {
                return (this.type==undefined)?"text":this.type; 
            }
        }, 
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
        props: ["name", "title"], 
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