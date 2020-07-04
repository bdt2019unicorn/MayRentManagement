Vue.component
(
    "text-input", 
    {
        props: ["name", "title", "type", "id", "controller"], 
        data()
        {
            return {
                input_value:""
            }
        }, 
        mixins: [support_mixin], 
        computed: 
        {
            InputType()
            {
                return (!this.type)?"text":this.type; 
            }
        }, 
        watch: 
        {
            controller: function(new_value, old_value)
            {
                this.input_value = ""; 
            }
        }, 
        template: 
        `
            <div class="form-group col">
                <label :for="name" v-if="title"><b>{{title}}</b></label>
                <input 
                    class="form-control"
                    :type="InputType"  
                    :name="name" 
                    :id="id"
                    v-model="input_value"
                >
            </div>
        `
    }
); 

Vue.component
(
    "text-group-confirmation", 
    {
        props: ["name", "title", "id", "confirm_name", "confirm_title"], 
        computed: 
        {
            InputType()
            {
                return (this.type==undefined)?"text":this.type; 
            }
        }, 
        template: 
        `
            <div class="form-group col">
                <div class="row">
                    <text-input
                        :name="name"
                        :title="title"
                        :id="id"
                    >
                    </text-input>

                    <text-input
                        :name="confirm_name"
                        :title="confirm_title"
                    >
                    </text-input>
                </div>
            </div>
        `
    }
); 

Vue.component
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

Vue.component 
(
    "number-input", 
    {
        props: ["name", "title", "minimum_value", "maximum_value", "decimal_places", "min"], 
        data()
        {
            return {
                number_value: undefined
            }
        }, 
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
            }, 
            MinimumMatched()
            {
                return (this.number_value)?((this.min!=undefined)?(this.number_value>=this.min): true): true; 
            }
        }, 
        mounted() 
        {
            this.$emit("input-validation", "number_minimum_matched", this.name, this.MinimumMatched);    
        },
        watch: 
        {
            MinimumMatched: function(new_value, old_value)
            {
                this.$emit("input-validation", "number_minimum_matched", this.name, this.MinimumMatched);   
            }
        },
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <vue-autonumeric
                    :name="name"
                    :options="Options"
                    v-model="number_value"
                    class="form-control"
                >
                </vue-autonumeric>
                <label :for="name" v-if="!MinimumMatched">
                    Please enter a number more than {{min}} 
                </label>
            </div>
        `
    }
); 

Vue.component
(
    "select-input", 
    {
        props: ["name", "title", "select_data", "overview_controller", "value", "text", "not_required", "controller"], 
        mixins: [support_mixin], 
        data() 
        {
            return {
                options: [], 
                selected_value: undefined
            }
        }, 
        methods: 
        {
            PopulateSelectData()
            {
                this.selected_value = undefined; 
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
        mounted() 
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

