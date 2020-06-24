var text_input = Vue.component
(
    "text-input", 
    {
        props: ["name", "title"], 
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <input type="text" class="form-control" :name="name">
            </div>
        `
    }
); 

var textarea_input = Vue.component
(
    "textarea-input", 
    {
        props: ["name", "title"], 
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <textarea class="form-control" :name="name">
                </textarea>
            </div>
        `
    }
); 

var date_input = Vue.component
(
    "date-input", 
    {
        props: ["name", "title", "required", "just_started_parent", "reference", "bad_message"], 
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
                if(this.required)
                {
                    return (this.date_value!=undefined); 
                }
                return true; 
            }, 
            JustStaredChild()
            {
                if(this.just_started_parent)
                {
                    return (this.date_value==undefined); 
                }
                else
                {
                    return this.just_started_parent; 
                }
            }, 
            RequiredLabel()
            {
                return (!this.DateRequired)&& this.JustStaredChild; 
            }, 
            SpecialMessageLabel()
            {
                if(this.RequiredLabel || !this.just_started_parent)
                {
                    return false; 
                }
                return (this.bad_message!=undefined); 
            }
        }, 
        mounted()
        {
            window.store_track.commit('DateTotal',{name:"date_required", value: this.DateRequired}); 
        }, 
        watch: 
        {
            DateRequired: function(new_value, old_value)
            {
                window.store_track.commit('DateCurrent',{name:"date_required", value: new_value}); 
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
        props: ["date_data"],
        data()
        {
            return {
                just_started_parent: false, 
                small_value: undefined, 
                big_value: undefined, 
            }
        }, 

        computed: 
        {
            DateRangeValid()
            {
                return this.big_value>this.small_value; 
            }
        }, 

        mounted()
        {
            window.store_track.commit('DateTotal',{name:"date_group_valid", value: this.DateRangeValid}); 
        }, 

        watch: 
        {
            DateRangeValid: function(new_value, old_value)
            {
                window.store_track.commit('DateCurrent',{name:"date_group_valid", value: new_value}); 
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
                this.just_started_parent = true; 
            }
        },

        template: 
        `
            <div class="form-group col">
                <div class="row">

                    <date-input 
                        v-bind=date_data.small_date
                        :just_started_parent="just_started_parent"
                        :bad_message="BadMessage('small_date')"
                        reference="small_value"
                        @date-value-changed="DateChange"
                    >
                    </date-input>


                    <date-input 
                        v-bind=date_data.big_date
                        :just_started_parent="just_started_parent"
                        :bad_message="BadMessage('big_date')"
                        reference="big_value"
                        @date-value-changed="DateChange"
                    >
                    </date-input>

                </div>

            </div> 
        `
    }
); 

var number_input = Vue.component 
(
    "number-input", 
    {
        props: ["name", "title", "maximum_value", "decimal_places"], 
        components: 
        {
            VueAutonumeric
        }, 
        computed: 
        {
            Options()
            {
                var options = {}; 
                var keys = ["maximum_value", "decimal_places"]; 
                function ChangeKey(key)
                {
                    var key_split = key.split('_'); 
                    var change_key = key_split[0]; 
                    for(var i=1;i<key_split.length; i++)
                    {
                        change_key+=key_split[i][0].toUpperCase()+key_split[i].substr(1); 
                    }
                    return change_key; 
                }
                keys.forEach
                (
                    key => 
                    {
                        if(this[key]!=undefined)
                        {
                            let new_key = ChangeKey(key); 
                            options[new_key] = this[key]; 
                        }
                    }
                );
                return options; 
            }   
        },
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <vue-autonumeric
                    :name="name"
                    :options="Options"
                    class="form-control"
                >
                </vue-autonumeric>
            </div>
        `
    }
); 

var select_input = Vue.component
(
    "select-input", 
    {
        props: ["name", "title", "overview_controller", "value", "text"], 
        mixins: [overview_data_mixins], 
        data() 
        {
            return {
                options: []
            }
        }, 
        mounted() 
        {
            var select_data = this.TableData(this.overview_controller);
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
        },
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <select :name="name" class="form-control">
                    <option v-if="options.length>0" hidden disabled selected value></option>
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