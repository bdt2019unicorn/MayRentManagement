Vue.component
(
    "component-group", 
    {
        props: ["component_data", "edit_data", "just_started_parent", "lock", "name"], 
        template: 
        `
            <div class="form-group col">
                <div class="row">
                    <component
                        v-for="component in component_data"
                        v-on="$listeners"
                        :is="component.component"
                        v-bind="component"
                        :edit_data="edit_data"
                        :lock="lock?lock.includes(component.name):undefined"
                        :just_started_parent="just_started_parent"
                    ></component>
                </div>
            </div>
        `
    }
); 

var date_group = Vue.component 
(
    "date-group", 
    {
        props: ["date_data", "edit_data", "just_started_parent", "name"],
        mixins: [support_mixin], 
        data()
        {
            return {
                just_started_child: false, 
                small_date: undefined, 
                big_date: undefined, 
                date_required: {}, 
                valid: true 
            }
        }, 

        computed: 
        {
            DateRangeValid()
            {
                return this.big_date>=this.small_date; 
            }, 
            JustStarted()
            {
                return this.just_started_parent || this.just_started_child; 
            }
        }, 
        methods: 
        {
            BadMessage(reference)
            {
                if([this.big_date, this.small_date].includes(undefined))
                {
                    return undefined; 
                }
                if(!this.DateRangeValid)
                {
                    return this.date_data[reference].message; 
                }
                return undefined; 
            }, 
            DateChange(new_value, reference)
            {
                this[reference] = new_value; 
                this.just_started_child = true; 
                this.valid = this.Valid(); 
                let name = this.date_data[reference].name; 
                if(this.valid)
                {
                    if(this.edit_data)
                    {
                        let new_value_format = moment(new_value).format("YYYY-MM-DD"); 
                        this.$emit("new-value-change-valid", this.edit_data, "valid", true, true); 
                        if(this.edit_data[name]!=new_value_format)
                        {
                            this.$emit("new-value-change-valid", this.edit_data, name, new_value_format); 
                        }
                    }
                }
                else 
                {
                    if(this.edit_data)
                    {
                        this.$emit("new-value-change-valid", this.edit_data, "valid", false, true); 
                    }
                }
            }, 
            DateInputValidation(data_field, name, boolean)
            {
                this[data_field][name] = boolean; 
                this.valid = this.Valid(); 
            }, 
            Valid()
            {
                return (this.big_date && this.small_date)? this.DateRangeValid: this.ValidObject(this.date_required); 
            }
        },
        mounted()
        {
            this.valid = this.Valid(); 
            this.$emit("input-validation", "date_group", this.name, this.valid); 
        }, 
        watch: 
        {
            valid: function(new_value, old_value)
            {
                this.$emit("input-validation", "date_group", this.name, this.valid); 
            }
        }, 
        template: 
        `
            <div class="form-group col">
                <div class="row">

                    <date-input 
                        v-bind=date_data.small_date
                        :just_started_parent="JustStarted"
                        :bad_message="BadMessage('small_date')"
                        :edit_data="edit_data"
                        reference="small_date"
                        @date-value-changed="DateChange"
                        @input-validation="DateInputValidation"
                    ></date-input>

                    <date-input 
                        v-bind=date_data.big_date
                        :just_started_parent="JustStarted"
                        :bad_message="BadMessage('big_date')"
                        :edit_data="edit_data"
                        reference="big_date"
                        @date-value-changed="DateChange"
                        @input-validation="DateInputValidation"
                    ></date-input>

                </div>

            </div> 
        `
    }
); 


