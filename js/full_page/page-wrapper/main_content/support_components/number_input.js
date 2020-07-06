Vue.component 
(
    "number-input", 
    {
        props: ["name", "title", "minimum_value", "maximum_value", "decimal_places", "min", "edit_data"], 
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
                        if(this[key])
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
                return (this.number_value!=undefined)?((this.min!=undefined)?(this.number_value>=this.min): true): true; 
            }
        }, 
        mounted() 
        {
            if(this.edit_data)
            {
                this.number_value = this.edit_data[this.name]; 
            }

            var list = 
            {
                min: 
                {
                    return: "Number(value)>=params", 
                    message: "Please enter a number bigger than {0}"
                }, 
                max:
                {
                    return: "Number(value)<=params", 
                    message: "Please enter a number smaller than {0}"
                }, 
                integer:
                {
                    return: "!Boolean(value%1)", 
                    message: "Please enter an integer number"
                }
            }; 

            let script = ""; 
            Object.keys(list).forEach
            (
                method=>
                {
                    script+= 
                    `
                        jQuery.validator.addMethod
                        (
                            "number_input_${method}", 
                            function(value, element, params)
                            {
                                if(!value.trim())
                                {
                                    return true; 
                                }
                                value = value.replace(/,/g,""); 
                                return ${list[method].return}; 
                            }, 
                            jQuery.validator.format("${list[method].message}")
                        ); 
                    `; 
                }
            ); 

            eval(script); 


            // this.$emit("input-validation", "number_minimum_matched", this.name, this.MinimumMatched);    
        },
        watch: 
        {
            MinimumMatched: function(new_value, old_value)
            {
                // this.$emit("input-validation", "number_minimum_matched", this.name, this.MinimumMatched);   
            }, 
            number_value: function(new_value, old_value)
            {

            }
        },
        methods: 
        {
        },
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <input type="text" class="form-control" :name="name" v-model="number_value">
            </div>
        `
    }
); 


// validation: min, max, decimal places or integer 


// Vue.component 
// (
//     "number-input", 
//     {
//         props: ["name", "title", "minimum_value", "maximum_value", "decimal_places", "min", "edit_data"], 
//         data()
//         {
//             return {
//                 number_value: undefined
//             }
//         }, 
//         components: 
//         {
//             VueAutonumeric
//         }, 
//         computed: 
//         {
//             Options()
//             {
//                 var options = {}; 
//                 var keys = ["maximum_value", "decimal_places"]; 
//                 function ChangeKey(key)
//                 {
//                     var key_split = key.split('_'); 
//                     var change_key = key_split[0]; 
//                     for(var i=1;i<key_split.length; i++)
//                     {
//                         change_key+=key_split[i][0].toUpperCase()+key_split[i].substr(1); 
//                     }
//                     return change_key; 
//                 }
//                 keys.forEach
//                 (
//                     key => 
//                     {
//                         if(this[key])
//                         {
//                             let new_key = ChangeKey(key); 
//                             options[new_key] = this[key]; 
//                         }
//                     }
//                 );
//                 return options; 
//             }, 
//             MinimumMatched()
//             {
//                 return (this.number_value!=undefined)?((this.min!=undefined)?(this.number_value>=this.min): true): true; 
//             }
//         }, 
//         mounted() 
//         {
//             if(this.edit_data)
//             {
//                 this.number_value = this.edit_data[this.name]; 
//             }
//             this.$emit("input-validation", "number_minimum_matched", this.name, this.MinimumMatched);    
//         },
//         watch: 
//         {
//             MinimumMatched: function(new_value, old_value)
//             {
//                 this.$emit("input-validation", "number_minimum_matched", this.name, this.MinimumMatched);   
//             }, 
//             number_value: function(new_value, old_value)
//             {

//             }
//         },
//         methods: 
//         {
//         },
//         template: 
//         `
//             <div class="form-group col">
//                 <label :for="name"><b>{{title}}</b></label>
//                 <vue-autonumeric
//                     :name="name"
//                     :options="Options"
//                     v-model="number_value"
//                     class="form-control"
//                 >
//                 </vue-autonumeric>
//                 <label :for="name" v-if="!MinimumMatched">
//                     Please enter a number more than {{min}} 
//                 </label>
//             </div>
//         `
//     }
// ); 