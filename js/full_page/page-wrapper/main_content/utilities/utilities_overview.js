Vue.component
(
    "UtilitiesOverview", 
    {
        props: [], 
        mixins: [support_mixin], 
        data()
        {
            return {
                date_picker: false, 
                end_date: undefined, 
                function_calendar_model: undefined, 
                main_url: "server/utilities_controller/utility_overview.php?command=", 
                select_data: 
                {
                    apartment: [], 
                    utilities: [], 
                    select_value: "id", 
                    text: "name", 
                    not_required: true
                }, 
                start_date: undefined, 
                table_data: []
            }
        }, 
        components: {FunctionalCalendar}, 
        created()
        {
            this.SelectData(); 
            this.UtilitiesTableData(); 
        }, 
        methods: 
        {
            TestBtn()
            {
                this.date_picker = !this.date_picker; 
            }, 
            TestClickedRange()
            {
                console.log("ranged"); 
                console.log(this.function_calendar_model); 
            }, 

            CalendarOpened()
            {
                new Promise
                (
                    (resolve,reject)=>
                    {
                        this.$refs["calendar"].ChooseDate("today"); 
                        resolve(); 
                    }
                ).then 
                (
                    ()=>
                    {
                        return new Promise
                        (
                            (resolve, reject)=>
                            {
                                this.function_calendar_model.dateRange.start = this.start_date; 
                                this.function_calendar_model.dateRange.end = this.end_date; 
                                resolve(); 
                            }
                        ); 
                    }
                ).then 
                (
                    ()=>
                    {
                        this.function_calendar_model = undefined; 
                    }
                ); 
                
            }, 
            SelectData()
            {
                let utility_data = this.AjaxRequest(`${this.main_url}SelectData`); 
                this.select_data.utilities = JSON.parse(utility_data); 
                this.select_data.apartment = this.TableData("apartment"); 
            }, 
            UtilitiesTableData()
            {
                this.table_data =                 
                [
                    {
                        id: 1, 
                        name: "test"
                    }, 
                    {
                        id: 2, 
                        name: "test"
                    }
                ]; 
            }
        




        },
        mounted() 
        {
            var today = new Date(); 
            let month = today.getMonth(); 
            let year = today.getFullYear(); 
            let last_day_of_month = new Date(year, month+1,0).getDate();   
            this.start_date = `${year}-${month+1}-1`; 
            this.end_date = `${year}-${month+1}-${last_day_of_month}`; 
        },
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>

                <div class="row">
                    <form class="container-fluid col">  
                        <div class="row">
                            <select-input :select_data="select_data.utilities" v-bind="select_data" name="utilities_id">All Utilities</select-input>
                            <select-input :select_data="select_data.apartment" v-bind="select_data" name="apartment_id">All Apartment</select-input>
                            <div class="col-2">
                                <button class="btn btn-primary">Search</button>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <input type="text" class="form-control" @click="TestBtn">
                                <FunctionalCalendar 
                                    ref="calendar" 
                                    v-if='date_picker' 
                                    class="col"
                                    dateFormat="yyyy-mm-dd" 
                                    :is-date-range='true' 
                                    v-model="function_calendar_model" 
                                    @dayClicked="TestClickedRange" 
                                    @opened="CalendarOpened"
                                ></FunctionalCalendar>

                                <input type="text" name="start_date" v-model="start_date">
                                <input type="text" name="end_date" v-model="end_date">
                            </div>

                            <div class="col-2">
                                <button class="btn btn-primary">Add</button>
                            </div>
                        </div>
                    </form>
                </div>
                <br>
                <scrolling-table :table_data="table_data"></scrolling-table>

            </div>
        `
    }
); 





// initialy, the function_calendar_model will be null 
// if the thing is opened, if it is just started, then choose the date. Otherwise

/// what we want, first start - choose the date for us. 
// close, get the date then set it to undefined. 
// mounted - choose the date then change the range 

// opened - set the date - then set it to undefined. 