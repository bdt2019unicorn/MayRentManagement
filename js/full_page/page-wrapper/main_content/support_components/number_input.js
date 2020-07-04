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