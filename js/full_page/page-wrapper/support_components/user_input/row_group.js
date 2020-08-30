Vue.component
(
    "row-group", 
    {
        props: ["edit_data", "index", "just_started_parent", "row"],
        mixins: [support_mixin], 
        data() 
        {
            return {
                date_group: {}, 
                date_required: {}, 
                row_group_valid: true 
            }
        }, 
        methods: 
        {
            InputValidation(data_field, name, boolean)
            {
                this[data_field][name] = boolean; 
                this.row_group_valid = (this.ValidObject(this.date_required) && this.ValidObject(this.date_group)); 
            }
        },
        mounted() 
        {
            this.row_group_valid = (this.ValidObject(this.date_required) && this.ValidObject(this.date_group)); 
            this.$emit("row-group-validation", this.index, this.row_group_valid); 
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
                    :key="col.name"
                    :just_started_parent="just_started_parent"
                    :edit_data="edit_data"
                    @input-validation="InputValidation"
                >
                </component>

            </div>
        `    
    }
);