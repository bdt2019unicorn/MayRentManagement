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
        // props: ["row"], 
        data() 
        {
            return {
                row: 
                [
                    {
                        component: "text-input", 
                        name: "first_name", 
                        title: "First Name"
                    }, 
                    {
                        component: "text-input", 
                        name: "last_name", 
                        title: "Last Name"
                    }, 
                    {
                        component: "date-input", 
                        name: "date_of_birth", 
                        title: "Date of Birth"
                    }
                ]
            }
        }, 
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
    "add-component", 
    {
    }
); 








function GiveMeFakeData()
{

}