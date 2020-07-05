Vue.component
(
    "select-input", 
    {
        props: ["name", "title", "select_data", "overview_controller", "value", "text", "not_required", "controller"], 
        mixins: [support_mixin], 
        data() 
        {
            return {
                options: [], 
                selected_value: undefined
            }
        }, 
        methods: 
        {
            PopulateSelectData()
            {
                this.selected_value = undefined; 
                var select_data = (this.select_data)?this.select_data: this.TableData(this.overview_controller);
                this.options = []; 
                select_data.forEach
                (
                    option => 
                    {
                        this.options.push 
                        (
                            {
                                value: option[this.value], 
                                text: option[this.text]
                            }
                        ); 
                    }
                ); 
            }   
        },
        mounted() 
        {
            this.PopulateSelectData(); 
        },
        watch: 
        {
            select_data: function(new_value, old_value)
            {   
                this.PopulateSelectData(); 
            }, 
            controller: function(new_value, old_value)    
            {
                this.PopulateSelectData(); 
            }
        },
        template: 
        `
            <div class="form-group col">
                <label :for="name" v-if="title"><b>{{title}}</b></label>
                <select :name="name" class="form-control" v-model="selected_value">
                    <option v-if="options.length>0" v-show="not_required&&selected_value" value selected></option>
                    <option
                        v-for="option in options"
                        :value="option.value"
                    >
                    {{option.text}}
                    </option>
                </select>
            </div>
        `
    }
); 

Vue.component
(
    "checkbox-input", 
    {
        props: ["name", "title"], 
        template: 
        `
            <div class="form-group col">
                <div class="form-check">
                    <input :name="name" type="checkbox" class="form-check-input" value="true">
                    <label :for="name" v-if="title" class="form-check-label"><b>{{title}}</b></label>
                </div>
            </div>
        `
    }
); 
