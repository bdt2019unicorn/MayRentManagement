Vue.component
(
    "select-input", 
    {
        props: ["not_required", "overview_controller", "select_data", "select_value", "text"], 
        mixins: [user_input_components_v_model_support_mixin], 
        data: ()=>({options: []}),
        created() 
        {
            this.PopulateSelectData();     
        },
        methods: 
        {
            PopulateSelectData()
            {
                var select_data = this.select_data || this.TableData(this.overview_controller, {edit: 1});
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
                <select :name="name" :style="LockStyle" class="form-control" v-model="content">
                    <option v-if="options.length" v-show="not_required&&value" value selected><slot></slot></option>
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
        props: ["overview_controller", "select_atributes", "select_data"], 
        mixins: [user_input_components_mixin], 
        data: () =>
        (
            {
                options: [], 
                value_model: []
            }
        ),
        components: {Multiselect: window.VueMultiselect.default}, 
        computed: 
        {
            MultiSelectBind()
            {
                return {
                    ...this.select_atributes, 
                    options: this.options, 
                }
            }
        },
        created() 
        {
            this.PopulateSelectData();     
        },
        methods: 
        {
            ID(option)
            {
                return Number(option[this.select_atributes["track-by"]]); 
            }, 
            PopulateSelectData()
            {
                this.options = this.select_data || this.TableData(this.overview_controller, {edit: 1});
            }, 
        },
        mounted() 
        {
            if(this.value)
            {
                let value = JSON.parse(this.value); 
                this.value_model = this.options.filter(option=>value.includes(this.ID(option))); 
            }
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
                this.value =`[${new_value.map(option=>this.ID(option)).join(",")}]`; 
                this.$emit("input", new_value); 
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
                <multiselect v-bind="MultiSelectBind" v-model="value_model" v-on="$listeners"></multiselect>
                <input type="text" hidden v-model="value" :name="name">
            </div>
        `
    }
); 


Vue.component
(
    "checkbox-input", 
    {
        mixins: [user_input_components_v_model_support_mixin], 
        mounted()
        {
            if(this.edit_data)
            {
                this.value = Number(this.value); 
            }
        }, 
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

