Vue.component 
(
    "number-input", 
    {
        props: ["edit_data", "name", "title"], 
        data()
        {
            return {
                number_display: undefined, 
                number_value: undefined
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
                    return: "Number(new_value)>=params", 
                    message: "Please enter a number bigger than {0}"
                }, 
                max:
                {
                    return: "Number(new_value)<=params", 
                    message: "Please enter a number smaller than {0}"
                }, 
                integer:
                {
                    return: "!Boolean(new_value%1)", 
                    message: "Please enter an integer number"
                }
            }; 

            let script = Object.keys(list).reduce
            (
                (accumulator, current_value)=>
                {
                    return accumulator+ 
                    `
                        jQuery.validator.addMethod
                        (
                            "number_input_${current_value}", 
                            function(value, element, params)
                            {
                                if(!value.trim())
                                {
                                    return true; 
                                }
                                let new_value = value.replace(/,/g,""); 
                                return ${list[current_value].return}; 
                            }, 
                            jQuery.validator.format("${list[current_value].message}")
                        ); 
                    `; 
                }, ""
            ); 
            eval(script); 
        },
        watch: 
        {
            number_display: function(new_value, old_value)
            {
                this.number_value = numeral(new_value).value(); 
            }, 
            number_value: function(new_value, old_value)
            {
                if(new_value==undefined)
                {
                    return; 
                }
                function CountDecimals(number)
                {
                    if(Math.floor(number.valueOf()) === number.valueOf())
                    {
                        return 0;
                    } 
                    return number.toString().split(".")[1].length || 0; 
                }

                let numeral_value = numeral(new_value); 
                let decimal_places = CountDecimals(numeral_value.value()); 
                let format = `0,0[.]${Array(decimal_places).fill("0").join("")}`; 

                this.number_display = numeral_value.format(format); 
            }
        },
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <input type="text" class="form-control" v-model="number_display">
                <input type="text" hidden :name="name" v-model="number_value">
            </div>
        `
    }
); 