Vue.component
(
    "row-group", 
    {
        props: ["row","just_started_parent", "controller", "index"],
        mixins: [support_mixin], 
        data() 
        {
            return {
                date_required: {}, 
                date_group: {}, 
                number_minimum_matched: {}, 
                row_group_valid: true 
            }
        }, 
        mounted() 
        {
            this.row_group_valid = (this.ValidObject(this.date_required) && this.ValidObject(this.date_group) && this.ValidObject(this.number_minimum_matched)); 
            this.$emit("row-group-validation", this.index, this.row_group_valid); 
        },
        methods: 
        {
            InputValidation(data_field, name, boolean)
            {
                this[data_field][name] = boolean; 
                this.row_group_valid = (this.ValidObject(this.date_required) && this.ValidObject(this.date_group) && this.ValidObject(this.number_minimum_matched)); 
            }
        },
        watch: 
        {
            row: function(new_value, old_value)
            {
                this.date_required = {}; 
                this.date_group = {}; 
                this.row_group_valid = true 
            }, 
            row_group_valid: function(new_value, old_value)
            {
                this.$emit("row-group-validation", this.index, this.row_group_valid); 
            }
        },
        template: 
        `
            <div class="row">
                <component 
                    v-for="col in row"
                    :is="col.component"
                    v-bind="col"
                    :just_started_parent="just_started_parent"
                    :controller="controller"
                    @input-validation="InputValidation"
                >
                </component>

            </div>
        `    
    }
);