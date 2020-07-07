Vue.component
(
    "select-input", 
    {
        props: ["controller", "edit_data", "name", "not_required", "overview_controller", "select_data", "select_value", "text", "title"], 
        mixins: [edit_mixin], 
        data() 
        {
            return {
                options: [], 
                value: undefined
            }
        }, 
        methods: 
        {
            PopulateSelectData()
            {
                this.value = undefined; 
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
        created() 
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
        props: ["edit_data", "name", "title"], 
        mixins: [edit_mixin], 
        data()
        {
            return {
                value: undefined
            }
        }, 
        template: 
        `
            <div class="form-group col">
                <div class="form-check">
                    <input :name="name" type="checkbox" class="form-check-input" value="true" :checked="Number(value)">
                    <label :for="name" v-if="title" class="form-check-label"><b>{{title}}</b></label>
                </div>
            </div>
        `
    }
); 

