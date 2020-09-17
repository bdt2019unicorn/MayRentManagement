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
            number_value: function(new_value, old_value)
            {

                // user nummeric here ----

                ///////////////////////////////////////////////////////

                // new_value = new_value.trim(); 
                // if(new_value.length<=3)
                // {
                //     return; 
                // }
                // let modify_value = new_value.replace(/,/g,""); 
                // let number_value = Number(modify_value); 

                // if(!number_value) 
                // {
                //     RemoveDecimal = (modify_value)=>
                //     {
                //         var string_array = modify_value.split("."); 
                //         var string = ""; 
                //         if(string_array.length>2)
                //         {
                //             string = `${string_array[0]}.${string_array[1]}`; 
                //             for (let index = 2; index < string_array.length; index++) 
                //             {
                //                 string+=string_array[index]; 
                //             }
                //         }
                //         else
                //         {
                //             string = modify_value; 
                //         }
                //         return string; 
                //     }; 
                //     RemoveBadCharacter = (string, start_position, end_position)=>
                //     {
                //         for (let index = start_position; index >= end_position; index--) 
                //         {
                //             if(string[index]!=".")
                //             {
                //                 let char_code = string.charCodeAt(index);
                //                 if(char_code<"0".charCodeAt(0) || char_code>"9".charCodeAt(0))
                //                 {
                //                     string = string.substr(0,index)+ string.substr(index+1); 
                //                     return RemoveBadCharacter(string, index-1, end_position); 
                //                 }
                //             }
                //         }
                //         return string; 
                //     }; 
                //     var string = RemoveDecimal(modify_value); 
                //     FindEndPosition = ()=>
                //     {
                //         if(string.length>0)
                //         {
                //             switch (string[0]) 
                //             {
                //                 case "+":
                //                     string = string.substring(1); 
                //                     break;
                //                 case ".":
                //                     string = "0"+ string; 
                //                     return 2;  
                //                 case "-": 
                //                     return 1; 
                //             }
                //             return 0; 
                //         }
                //     }
                //     var end_position = FindEndPosition(); 
                //     modify_value = RemoveBadCharacter(string, string.length-1, end_position); 
                // }

                // AddSeparator = (string)=>
                // {
                //     let addition = string[0]; 
                //     let modify_string = ""; 
                //     for (let index = 1; index < string.length; index++) 
                //     {
                //         modify_string=string[string.length-index] + modify_string; 
                //         if(index%3==0)
                //         {
                //             modify_string="," + modify_string; 
                //         }
                //     }

                //     let modify_string_script = 
                //     `
                //         if(modify_string[0]==",")
                //         {
                //             modify_string = modify_string.substr(1); 
                //         }
                //     `; 

                //     if(addition=="-")
                //     {
                //         eval(modify_string_script); 
                //     }
                //     else if(addition=="+")
                //     {
                //         addition=""; 
                //         eval(modify_string_script); 
                //     }
                //     return addition + modify_string; 
                // }; 
                // number_value = modify_value.split("."); 
                // modify_value = (number_value[1]!=undefined)?`.${number_value[1]}`: ""; 
                // modify_value = AddSeparator(number_value[0]) + modify_value; 
                // this.number_value = modify_value; 
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


// Vue.component 
// (
//     "number-input-test", 
//     {
//         props: ["edit_data", "name", "title"], 
//         data()
//         {
//             return {
//                 number_value: undefined
//             }
//         }, 
//         mounted() 
//         {
//             if(this.edit_data)
//             {
//                 this.number_value = this.edit_data[this.name]; 
//             }

//             var list = 
//             {
//                 min: 
//                 {
//                     return: "Number(new_value)>=params", 
//                     message: "Please enter a number bigger than {0}"
//                 }, 
//                 max:
//                 {
//                     return: "Number(new_value)<=params", 
//                     message: "Please enter a number smaller than {0}"
//                 }, 
//                 integer:
//                 {
//                     return: "!Boolean(new_value%1)", 
//                     message: "Please enter an integer number"
//                 }
//             }; 

//             let script = ""; 
//             Object.keys(list).forEach
//             (
//                 method=>
//                 {
//                     script+= 
//                     `
//                         jQuery.validator.addMethod
//                         (
//                             "number_input_${method}", 
//                             function(value, element, params)
//                             {
//                                 if(!value.trim())
//                                 {
//                                     return true; 
//                                 }
//                                 let new_value = value.replace(/,/g,""); 
//                                 return ${list[method].return}; 
//                             }, 
//                             jQuery.validator.format("${list[method].message}")
//                         ); 
//                     `; 
//                 }
//             ); 

//             eval(script); 
//         },
//         watch: 
//         {
//             number_value: function(new_value, old_value)
//             {
//                 new_value = new_value.trim(); 
//                 if(new_value.length<=3)
//                 {
//                     return; 
//                 }
//                 let modify_value = new_value.replace(/,/g,""); 
//                 let number_value = Number(modify_value); 

//                 if(!number_value) 
//                 {
//                     RemoveDecimal = (modify_value)=>
//                     {
//                         var string_array = modify_value.split("."); 
//                         var string = ""; 
//                         if(string_array.length>2)
//                         {
//                             string = `${string_array[0]}.${string_array[1]}`; 
//                             for (let index = 2; index < string_array.length; index++) 
//                             {
//                                 string+=string_array[index]; 
//                             }
//                         }
//                         else
//                         {
//                             string = modify_value; 
//                         }
//                         return string; 
//                     }; 
//                     RemoveBadCharacter = (string, start_position, end_position)=>
//                     {
//                         for (let index = start_position; index >= end_position; index--) 
//                         {
//                             if(string[index]!=".")
//                             {
//                                 let char_code = string.charCodeAt(index);
//                                 if(char_code<"0".charCodeAt(0) || char_code>"9".charCodeAt(0))
//                                 {
//                                     string = string.substr(0,index)+ string.substr(index+1); 
//                                     return RemoveBadCharacter(string, index-1, end_position); 
//                                 }
//                             }
//                         }
//                         return string; 
//                     }; 
//                     var string = RemoveDecimal(modify_value); 
//                     FindEndPosition = ()=>
//                     {
//                         if(string.length>0)
//                         {
//                             switch (string[0]) 
//                             {
//                                 case "+":
//                                     string = string.substring(1); 
//                                     break;
//                                 case ".":
//                                     string = "0"+ string; 
//                                     return 2;  
//                                 case "-": 
//                                     return 1; 
//                             }
//                             return 0; 
//                         }
//                     }
//                     var end_position = FindEndPosition(); 
//                     modify_value = RemoveBadCharacter(string, string.length-1, end_position); 
//                 }

//                 AddSeparator = (string)=>
//                 {
//                     let addition = string[0]; 
//                     let modify_string = ""; 
//                     for (let index = 1; index < string.length; index++) 
//                     {
//                         modify_string=string[string.length-index] + modify_string; 
//                         if(index%3==0)
//                         {
//                             modify_string="," + modify_string; 
//                         }
//                     }

//                     let modify_string_script = 
//                     `
//                         if(modify_string[0]==",")
//                         {
//                             modify_string = modify_string.substr(1); 
//                         }
//                     `; 

//                     if(addition=="-")
//                     {
//                         eval(modify_string_script); 
//                     }
//                     else if(addition=="+")
//                     {
//                         addition=""; 
//                         eval(modify_string_script); 
//                     }
//                     return addition + modify_string; 
//                 }; 
//                 number_value = modify_value.split("."); 
//                 modify_value = (number_value[1]!=undefined)?`.${number_value[1]}`: ""; 
//                 modify_value = AddSeparator(number_value[0]) + modify_value; 
//                 this.number_value = modify_value; 
//             }
//         },
//         template: 
//         `
//             <div class="form-group col">
//                 <label :for="name"><b>{{title}}</b></label>
//                 <input type="text" class="form-control" :name="name" v-model="number_value">
//             </div>
//         `
//     }
// ); 