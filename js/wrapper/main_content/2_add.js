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
        props: ["name", "title"], 
        data()
        {
            return {
                date_value:undefined
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

                <!-- <label class="error" :for="name"></label> -->
            </div>
        `
    }
); 


// sort out the issue with the date requirement, a bit tough to deal with at the moment 

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

var row_group = Vue.component
(
    "row-group", 
    {
        props: ["row"], 
        template: 
        `
            <div>
                <br>
                <div class="row">
                    <component 
                        v-for="col in row"
                        :is="col.component"
                        v-bind="col"
                    >
                    </component>

                </div>
            </div>
        `    
    }
);



var add_component = Vue.component
(
    "Add", 
    {
        data()
        {
            return {
                title: "Add ", 
                form: [], 
                validate: {}
            }
        }, 
        methods: 
        {
            SubmitForm(event)
            {
                if(!$(this.$refs["action_form"]).valid())
                {
                    return; 
                }
                let data = $(event.target).serializeObject(); 
                let result = ImportData([data]); 
                if(result==true)
                {
                    alert(this.title+" Success!"); 
                    $(event.target).trigger("reset"); 
                }
                else
                {
                    alert(this.title+" Fails, please try again!"); 
                }
            }   
        },

        mounted()
        {
            $(this.$refs["action_form"]).validate(this.validate); 
        }, 

        created() 
        {
            var data = GetFormDataFields();
            try 
            {
                this.form = data.form; 
                this.title+=data.title; 
                this.validate = (data.validate!=undefined)?data.validate:this.validate; 
            } 
            catch
            {
                this.form = []; 
                this.title ="Add "; 
            }

        },

        template: 
        `
            <form 
                class="container-fluid"
                @submit.prevent="SubmitForm"
                ref="action_form"
            >
                <h1 style="text-align: center;">{{title}}</h1>
                <row-group
                    v-for="row in form"
                    :row="row"
                >
                </row-group>
            
                <div>
                    <br>
                    <div class="row">
                        <div class="form-group col-2">
                            <button type="reset" class="btn" title="Clear">
                                <i style="font-size: xx-large;" class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="form-group col-8">
                        </div>
                        <div class="form-group col-2">
                            <button type="submit" class="btn" :title="title">
                                <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        `
    }
); 