Vue.component
(
    "row-group", 
    {
        props: ["row","just_started_parent", "controller", "index"],
        data() 
        {
            return {
                date_required: {}, 
                date_group: {}, 
                row_group_valid: true 
            }
        }, 
        mounted() 
        {
            this.row_group_valid = this.RowGroupValid(); 
            this.$emit("row-group-mounted", this.index, this.row_group_valid); 
        },
        methods: 
        {
            RowGroupValid()
            {
                return (Object.values(this.date_required).length>0)?!(Object.values(this.date_required).includes(false)): true; 
            }, 
            DateInputValidation(data_field, name, boolean)
            {
                this[data_field][name] = boolean; 
                this.row_group_valid = this.RowGroupValid(); 
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
                    @date-input-validation="DateInputValidation"
                >
                </component>

            </div>
        `    
    }
);