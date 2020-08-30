Vue.component
(
    "select-input", 
    {
        props: ["edit_data", "name", "not_required", "overview_controller", "select_data", "select_value", "text", "title"], 
        mixins: [edit_mixin], 
        data() 
        {
            return {
                options: [], 
            }
        },
        created() 
        {
            this.PopulateSelectData();     
        },
        methods: 
        {
            PopulateSelectData()
            {
                this.value = ""; 
                var select_data = (this.select_data)?this.select_data:this.TableData(this.overview_controller, {edit: 1});
                this.options = select_data.map
                (
                    option=>
                    (
                        {
                            value: option[this.select_value], 
                            text: option[this.text]
                        }
                    )
                ); 
            }, 
        },
        watch: 
        {
            select_data: function(new_value, old_value)
            {   
                this.PopulateSelectData(); 
            }, 
            value: function(new_value, old_value)
            {
                this.$emit("search-data-changed"); 
            }, 
            edit_data: function(new_value, old_value)
            {
                this.BringEditData(); 
            }

        },
        template: 
        `
            <div class="form-group col">
                <label :for="name" v-if="title"><b>{{title}}</b></label>
                <select :name="name" class="form-control" v-model="value">
                    <option v-if="options.length>0" v-show="not_required&&value" value selected><slot></slot></option>
                    <option v-for="option in options" :value="option.value">{{option.text}}</option>
                </select>
            </div>
        `
    }
); 

Vue.component
(
    "multi-select-input", 
    {
        props: ["edit_data", "name", "not_required", "overview_controller", "select_atributes", "select_data", "select_value", "text", "title"], 
        mixins: [edit_mixin], 
        data() 
        {
            return {
                options: [], 
                value_model: []
            }
        },
        components: {Multiselect: window.VueMultiselect.default}, 
        computed: 
        {
            MultiSelectBind()
            {
                return {
                    ...this.select_atributes, 
                    options: this.options, 
                    name: this.name 
                }
            }
        },
        created() 
        {
            this.PopulateSelectData();     
        },
        methods: 
        {
            PopulateSelectData()
            {
                this.value_model = []; 
                var select_data = (this.select_data)?this.select_data:this.TableData(this.overview_controller, {edit: 1});
                this.options = select_data.map
                (
                    option=>
                    (
                        {
                            value: option[this.select_value], 
                            text: option[this.text]
                        }
                    )
                ); 
            }, 
        },
        watch: 
        {
            select_data: function(new_value, old_value)
            {   
                this.PopulateSelectData(); 
            }, 
            value: function(new_value, old_value)
            {
                this.$emit("search-data-changed"); 
            }, 
            value_model: function(new_value, old_value)
            {
                this.value = `[${new_value.map(option=>option.value).join(",")}]`; 
            }, 
            edit_data: function(new_value, old_value)
            {
                this.BringEditData(); 
            }

        },
        template: 
        `
            <div class="form-group col">
                <label :for="name" v-if="title"><b>{{title}}</b></label>
                <multiselect v-bind="MultiSelectBind" v-model="value_model"></multiselect>
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
        template: 
        `
            <div class="form-group col">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" value="1" v-model='value'>
                    <input hidden type="text" :name="name" v-model="Number(this.value).toString()">
                    <label :for="name" v-if="title" class="form-check-label"><b>{{title}}</b></label>
                </div>
            </div>
        `
    }
); 

