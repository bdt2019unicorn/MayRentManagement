var date_input = Vue.component
(
    "date-input", 
    {
        props: ["name", "title", "required", "just_started_parent", "reference", "bad_message", "edit_data"], 
        data()
        {
            return {
                date_value:undefined, 
            }
        }, 
        computed: 
        {
            DateRequired()
            {
                return (this.required)?(this.date_value!=undefined): true; 
            }, 
            JustStaredChild()
            {
                return (this.just_started_parent)? (this.date_value==undefined): this.just_started_parent; 
            }, 
            RequiredLabel()
            {
                return (!this.DateRequired)&& this.JustStaredChild; 
            }, 
            SpecialMessageLabel()
            {
                return (this.RequiredLabel || !this.just_started_parent)?false: (this.bad_message!=undefined); 
            }
        }, 
        mounted()
        {
            if(this.edit_data)
            {
                this.date_value = new Date(this.edit_data[this.name]); 
            }
            this.$emit("input-validation", "date_required", this.name, this.DateRequired); 
        }, 
        watch: 
        {
            DateRequired: function(new_value, old_value)
            {
                this.$emit("input-validation", "date_required", this.name, this.DateRequired); 
            }, 
            date_value: function(new_value, old_value)
            {
                this.$emit("date-value-changed", new_value, this.reference); 
            }
        },
        components: 
        {
            vuejsDatepicker
        }, 
        template: 
        `
            <div class="form-group col">
                <label for="company_address"><b>{{title}}</b></label>
                <vuejs-datepicker 
                    input-class="form-control" 
                    format="dd/MM/yyyy" 
                    v-model="date_value"
                >
                </vuejs-datepicker>
                <vuejs-datepicker
                    format="MM/dd/yy"
                    v-model="date_value"
                    v-show="false"
                    :name="name"
                >
                </vuejs-datepicker>

                <label :for="name" v-show="RequiredLabel">
                    This field is required.
                </label> 

                <label :for="name" v-if="SpecialMessageLabel">
                    {{bad_message}}
                </label>
            </div>
        `
    }
); 

var date_group = Vue.component 
(
    "date-group", 
    {
        props: ["date_data", "name", "just_started_parent", "edit_data"],
        mixins: [support_mixin], 
        data()
        {
            return {
                just_started_child: false, 
                small_value: undefined, 
                big_value: undefined, 
                date_required: {}, 
                valid: true 
            }
        }, 

        computed: 
        {
            JustStarted()
            {
                return this.just_started_parent || this.just_started_child; 
            }, 
            DateRangeValid()
            {
                return this.big_value>this.small_value; 
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

        methods: 
        {
            BadMessage(reference)
            {
                if([this.big_value, this.small_value].includes(undefined))
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
            }, 
            DateInputValidation(data_field, name, boolean)
            {
                this[data_field][name] = boolean; 
                this.valid = this.Valid(); 
            }, 
            Valid()
            {
                return (this.big_value && this.small_value)? this.DateRangeValid: this.ValidObject(this.date_required); 
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
                        reference="small_value"
                        @date-value-changed="DateChange"
                        @input-validation="DateInputValidation"
                    >
                    </date-input>


                    <date-input 
                        v-bind=date_data.big_date
                        :just_started_parent="JustStarted"
                        :bad_message="BadMessage('big_date')"
                        :edit_data="edit_data"
                        reference="big_value"
                        @date-value-changed="DateChange"
                        @input-validation="DateInputValidation"
                    >
                    </date-input>

                </div>

            </div> 
        `
    }
); 