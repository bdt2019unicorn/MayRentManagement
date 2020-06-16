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
                        :name="col.name"
                        :title="col.title"
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
                form: [], 
                title: "Add "
            }
        }, 
        methods: 
        {
            SubmitForm(event)
            {
                var form = event.target; 
            }   
        },

        created() 
        {
            var data = GetFormDataFields();
            try 
            {
                this.form = data.form; 
                this.title+=data.title; 
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