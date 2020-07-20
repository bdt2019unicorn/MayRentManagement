Vue.component
(
    "utilities-overview", 
    {
        props: [], 
        mixins: [support_mixin], 
        data()
        {
            return {
                date_picker_opened: false, 
                end_date: undefined, 
                function_calendar_model: undefined, 
                main_url: "server/utilities_controller/utility_overview.php?command=", 
                select_data: 
                {
                    apartment: [], 
                    utilities: [], 
                    select_value: "id", 
                    text: "name", 
                }, 
                start_date: undefined, 
                table_action: {}, 
                table_data: [],
            }
        }, 
        components: {FunctionalCalendar}, 
        computed: 
        {
            EditSelectUtilitiesData()
            {
                try 
                {
                    return {
                        revenue_type_id: this.select_data.utilities[0].id 
                    }; 
                }
                catch
                {
                    return undefined; 
                }
            }, 
            LabelDateRange()
            {
                return `${moment(this.start_date).format('DD MMM YYYY')} - ${moment(this.end_date).format('DD MMM YYYY')}`; 
            }, 
            TableDataUrl()
            {
                return `server/overview_controller/utilities.php?building_id=${this.BuildingId}`; 
            }
        },
        created()
        {
            this.SelectData(); 
            this.ThisMonthDayRange();
            this.table_action = this.TableActions("utilities"); 
            
            var search_data = new FormData(); 
            search_data.append("revenue_type_id", this.EditSelectUtilitiesData.revenue_type_id); 
            search_data.append("start_date", this.start_date); 
            search_data.append("end_date", this.end_date); 
            this.table_data = JSON.parse(this.AjaxRequest(this.TableDataUrl, search_data,"post")); 
        }, 
        methods: 
        {
            CalendarChooseDay()
            {
                try 
                {
                    if(this.function_calendar_model.dateRange.end)
                    {
                        this.start_date = this.function_calendar_model.dateRange.start; 
                        this.end_date = this.function_calendar_model.dateRange.end; 
                        this.function_calendar_model = undefined; 
                        this.date_picker_opened = false; 
                    }
                }
                catch {}
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
            SearchData(event)
            {
                var search_data = new FormData(event.target); 
                this.table_data = JSON.parse(this.AjaxRequest(this.TableDataUrl, search_data,"post")); 
            }, 
            SelectData()
            {
                let utility_data = this.AjaxRequest(`${this.main_url}SelectData`); 
                this.select_data.utilities = JSON.parse(utility_data); 
                this.select_data.apartment = this.TableData("apartment"); 
            }, 
            ThisMonthDayRange()
            {
                var today = new Date(); 
                let month = today.getMonth(); 
                let year = today.getFullYear(); 
                let last_day_of_month = new Date(year, month+1,0).getDate();   
                this.start_date = `${year}-${month+1}-1`; 
                this.end_date = `${year}-${month+1}-${last_day_of_month}`; 
            }
        },
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>

                <div class="row">
                    <form class="container-fluid col" @submit.prevent="SearchData">  
                        <div class="row">
                            <select-input :select_data="select_data.utilities" v-bind="select_data" name="revenue_type_id" :edit_data="EditSelectUtilitiesData"></select-input>
                            <select-input :select_data="select_data.apartment" v-bind="select_data" name="apartment_id" :not_required="true">All Apartment</select-input>
                            <div class="col-2">
                                <button type="submit" class="btn btn-primary">Search</button>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <input type="text" class="form-control" @click="date_picker_opened = !date_picker_opened" readonly style="text-align: center;":value="LabelDateRange">
                                <FunctionalCalendar 
                                    ref="calendar" 
                                    v-if='date_picker_opened' 
                                    class="col"
                                    dateFormat="yyyy-mm-dd" 
                                    :is-date-range='true' 
                                    v-model="function_calendar_model" 
                                    @opened="CalendarOpened"
                                    @choseDay="CalendarChooseDay"
                                ></FunctionalCalendar>

                                <input type="text" name="start_date" v-model="start_date" hidden>
                                <input type="text" name="end_date" v-model="end_date" hidden>
                            </div>

                            <div class="col-2">
                                <button type="button" class="btn btn-primary">Add</button>
                            </div>
                        </div>
                    </form>
                </div>
                <br>
                <scrolling-table :table_data="table_data" :table_actions='table_action'></scrolling-table>

            </div>
        `
    }
); 