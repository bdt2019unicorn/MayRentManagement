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
        // data() 
        // {
        //     return {
        //         row: 
        //         [
        //             {
        //                 component: "text-input", 
        //                 name: "first_name", 
        //                 title: "First Name"
        //             }, 
        //             {
        //                 component: "text-input", 
        //                 name: "last_name", 
        //                 title: "Last Name"
        //             }, 
        //             {
        //                 component: "date-input", 
        //                 name: "date_of_birth", 
        //                 title: "Date of Birth"
        //             }
        //         ]
        //     }
        // }, 
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
        data()
        {
            return {
                form: [], 
                title: "Add"
            }
        }, 

        created() 
        {
            var data = GiveMeFakeData(); 
            this.form = data.form; 
            this.title+=data.title; 
        },

        template: 
        `
            <form class="container-fluid">

                <row-group
                    v-for="row in form"
                    :row="row"
                >
                </row-group>
            
                <div>
                    <br>
                    <div class="row">
                        <div class="form-group col-10">
                        </div>
                        <div class="form-group col-2">
                            <button type="submit" class="btn">
                                <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        `
    }
); 








function GiveMeFakeData()
{
    var form =  
    [
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
        ], 
        [
            {
                component: "text-input", 
                name: "passport_id_number", 
                title: "Passport/ID Number"
            }, 
            {
                component: "text-input", 
                name: "Nationality", 
                title: "Nationality"
            }
        ], 
        [
            {
                component: "text-input", 
                name: "mobile_phone", 
                title: "Mobile Phone"
            }, 
            {
                component: "text-input", 
                name: "work_phone", 
                title: "Work Phone"
            }
        ], 
        [
            {
                component: "text-input", 
                name: "personal_email", 
                title: "Personal Email"
            }, 
            {
                component: "text-input", 
                name: "work_email", 
                title: "Work Email"
            }
        ], 
        [
            {
                component: "text-input", 
                name: "company_name", 
                title: "Company Name"
            }, 
            {
                component: "text-input", 
                name: "company_address", 
                title: "Company Address"
            }
        ]
    ]
    var title = "Tenant"; 
    return {
        title: title, 
        form: form
    }; 
}