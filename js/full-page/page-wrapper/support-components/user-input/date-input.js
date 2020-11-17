var date_input = Vue.component
(
    "date-input", 
    {
        props: ["bad_message", "just_started_parent", "reference", "required"], 
        mixins: [user_input_support_mixin], 
        data()
        {
            return {
                date_value:undefined, 
            }
        }, 
        components: {vuejsDatepicker}, 
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
                let date = this.edit_data[this.name]? new Date(this.edit_data[this.name]): undefined; 
                if(date instanceof Date && isNaN(date))
                {
                    date = undefined; 
                }

                this.date_value = date; 
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
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <vuejs-datepicker 
                    :style="LockStyle" 
                    calendar-class="calendar-right-align" 
                    input-class="form-control" 
                    format="dd/MM/yyyy" 
                    v-model="date_value" 
                    :name="name"
                ></vuejs-datepicker>
                <label :for="name" v-show="RequiredLabel">This field is required.</label> 
                <label :for="name" v-if="SpecialMessageLabel">{{bad_message}}</label>
            </div>
        `
    }
); 
