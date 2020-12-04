Vue.component
(
    "general-utilities", 
    {
        props: ["select_data", "table_data"],
        mixins: [general_utilities_mixin], 
        data()
        {
            return {
                date_picker_opened: false, 
                end_date: undefined, 
                function_calendar_model: undefined, 
                revenue_type_id: undefined, 
                start_date: undefined, 
                table_action: {}
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
                return `${this.DateReformatDisplay(this.start_date)} - ${this.DateReformatDisplay(this.end_date)}`; 
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
            ThisMonthDayRange()
            {
                this.start_date = this.AjaxRequest(`${this.main_url}SelectStartDate&revenue_type_id=${this.revenue_type_id}&${this.$route.query.id?`unit_id=${this.$route.query.id}`: `building_id=${this.$route.params.building_id}`}`); 
                this.end_date = moment().endOf('month').format('YYYY-MM-DD');
            }
        },
        mounted()
        {
            new Promise
            (
                (resolve, reject)=>
                {
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
                            <select-input :select_data="select_data.utilities" v-bind="select_data" name="revenue_type_id" :edit_data="EditSelectUtilitiesData" @search-data-changed="Search" v-model="revenue_type_id"></select-input>
                            <slot name="form_units_select" v-bind:select_data="select_data"></slot>
                        </div>

                        <div class="row">
                            <div class="col">
                                <input type="text" class="form-control text-center" @click="date_picker_opened = !date_picker_opened" readonly :value="LabelDateRange">
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
                            <slot name="utility_overview"></slot>
                        </div>
                    </form>
                </div>
                <br>
                <slot name="utility_price"></slot>
                <scrolling-table :table_data="table_data" :table_actions='table_action'></scrolling-table>

            </div>
        `
    }
); 