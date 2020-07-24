Vue.component
(
    "general-utilities", 
    {
        props: ["table_data"],
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
                    utilities: [], 
                    select_value: "id", 
                    text: "name", 
                }, 
                start_date: undefined, 
                table_action: {}, 
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
            UtilityNameSearchById()
            {
                let utility_name_by_id = {}; 
                this.select_data.utilities.forEach
                (
                    element => 
                    {
                        utility_name_by_id[element.id] = element.name; 
                    }
                );
                return utility_name_by_id; 
            }
        },
        methods: 
        {
            CalendarChooseDay()
            {
                try 
                {
                    if(this.function_calendar_model.dateRange.end)
                    {
                        new Promise
                        (
                            (resolve, reject)=>
                            {
                                this.start_date = this.function_calendar_model.dateRange.start; 
                                this.end_date = this.function_calendar_model.dateRange.end; 
                                this.function_calendar_model = undefined; 
                                this.date_picker_opened = false; 
                                resolve(); 
                            }
                        ).then(this.Search); 
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
            Search(event=undefined)
            {
                var search_data = new FormData(this.$refs["search_form"]); 
                this.$emit("search-data-changed", search_data, Boolean(event)); 
            }, 
            SelectData()
            {
                let utility_data = this.AjaxRequest(`${this.main_url}SelectData`); 
                this.select_data.utilities = JSON.parse(utility_data); 
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
        mounted()
        {
            new Promise
            (
                (resolve, reject)=>
                {
                    this.SelectData(); 
                    this.ThisMonthDayRange();
                    this.table_action = this.TableActions("utilities"); 
                    resolve(true); 
                }
            ).then(this.Search); 
        }, 
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>

                <div class="row">
                    <form class="container-fluid col" @submit.prevent="Search" ref="search_form">  
                        <div class="row">
                            <select-input :select_data="select_data.utilities" v-bind="select_data" name="revenue_type_id" :edit_data="EditSelectUtilitiesData" @search-data-changed="Search"></select-input>
                            <slot name="form_apartments_select" v-bind:select_data="select_data"></slot>
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

                            <slot name="add_utilities"></slot>
                        </div>
                    </form>
                </div>
                <br>
                <slot name="utility_price" v-bind:UtilityNameSearchById="UtilityNameSearchById"></slot>
                <scrolling-table :table_data="table_data" :table_actions='table_action'></scrolling-table>

            </div>
        `
    }
); 