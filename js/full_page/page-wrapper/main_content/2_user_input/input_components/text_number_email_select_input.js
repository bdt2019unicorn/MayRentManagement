var text_input = Vue.component
(
    "text-input", 
    {
        props: ["name", "title", "type", "id"], 
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
                <label :for="name"><b>{{title}}</b></label>
                <input :type="InputType" class="form-control" :name="name" :id="id">
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
        mixins: [support_mixin], 
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