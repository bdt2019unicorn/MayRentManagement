var text_input = Vue.component
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

var text_group_confirmation = Vue.component
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

var number_input = Vue.component 
(
    "number-input", 
    {
        props: ["name", "title", "minimum_value", "maximum_value", "decimal_places"], 
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
                        console.log(key, this[key]); 
                        if(this[key]!=undefined)
                        {
                            let new_key = ChangeKey(key); 
                            options[new_key] = this[key]; 
                            console.log("I am changing you "); 
                        }
                    }
                );
                console.log(options); 
                return options; 
            }, 
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
            </div>
        `
    }
); 

var select_input = Vue.component
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




// Vue.component
// (
//     "test-component", 
//     {
//         data() {
//             return {
//                 array: 
//                 [
//                     {
//                         id: 1, 
//                         value: "one"
//                     }, 
//                     {
//                         id: 2, 
//                         value: "two"
//                     }, 
//                     {
//                         id: 3, 
//                         value: "three"
//                     }
//                 ]
//             }
//         },

//         template: 
//         `
//             <div>
//                 <h1>I am the test component</h1>
//                 <div
//                     v-for="(row, index) in array" 
//                 >
//                     <h3>My ID is {{row.id}}</h3>
//                     <h4>My value is {{row.value}}</h4>
//                     <p>My index is {{index}}</p>
//                     <p>My row thing is {{row}} </p>
//                 </div>
//             </div>
//         `
//     }
// )