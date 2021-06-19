class GeneralUtilities extends GeneralUtilities 
{
    // props: ["select_data", "table_data"],
    // mixins: [general_utilities_mixin], 
    constructor(props)
    {
        super(props);
        this.state = 
        {
            ...this.state, 
            date_picker_opened: false, 
            end_date: undefined, 
            function_calendar_model: undefined, 
            revenue_type_id: undefined, 
            start_date: undefined, 
            table_action: {}
        }; 
    } 
    // mounted()
    // {
    //     new Promise
    //     (
    //         (resolve, reject)=>
    //         {
    //             this.ThisMonthDayRange();
    //             this.table_action = this.TableActions("utilities"); 
    //             resolve(true); 
    //         }
    //     ).then(this.Search); 
    // }, 
    CalendarChooseDay = () => 
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
        catch (exception) {}
    } 
    CalendarOpened = () => 
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
        ).then(()=>this.function_calendar_model = undefined); 
    }
    EditSelectUtilitiesData = () => 
    {
        try 
        {
            return {
                revenue_type_id: this.select_data.utilities[0].id 
            }; 
        }
        catch (exception)
        {
            return undefined; 
        }
    } 
    LabelDateRange = () => 
    {
        return `${this.DateReformatDisplay(this.start_date)} - ${this.DateReformatDisplay(this.end_date)}`; 
    }
    Search = (event=undefined) => 
    {
        var search_data = new FormData(this.$refs["search_form"]); 
        this.$emit("search-data-changed", search_data, Boolean(event)); 
    } 
    ThisMonthDayRange = () => 
    {
        this.start_date = this.AjaxRequest(`${this.main_url}SelectStartDate&revenue_type_id=${this.revenue_type_id}&${this.$route.query.id?`unit_id=${this.$route.query.id}`: `building_id=${this.$route.params.building_id}`}`); 
        this.end_date = moment().endOf('month').format('YYYY-MM-DD');
    }
    render()
    {
        var Grid = MaterialUI.Grid; 
        var { select_data, FormUnitsSelect } = this.props; 
        return (
            <div>
                <h1>Tiện ích</h1>
                <form onSubmit={(event)=>{event.preventDefault(); console.log("submit")}}>
                    <Grid container spacing={1}>
                        <Grid item xs={FormUnitsSelect ? 5 : 12}>
                            <SelectInput
                                select_data={select_data.utilities} 
                                {...select_data}
                                name="revenue_type_id" 
                                title="Loại tiện ích"
                                // edit_data="EditSelectUtilitiesData" 
                                // search-data-changed="Search" 
                                value={this.state.revenue_type_id}
                                ValueChange={({value})=>this.setState({revenue_type_id: value})}
                            />
                        </Grid>
                        {FormUnitsSelect || null}
                    </Grid>
                </form>


                
									{/* <RangeDatePicker
										startDate={this.state.startDate}
										endDate={this.state.endDate}
										onChange={(startDate, endDate) => this.setState({startDate, endDate})}
										dateFormat="DD/MM/YYYY"
										monthFormat="MMM YYYY"
										startDatePlaceholder="Start Date"
										endDatePlaceholder="End Date"
										className="my-own-class-name"
										highlightToday
									/> */}

                {/* <div class="row"> */}
                    {/* <form class="container-fluid col" @submit.prevent="Search" ref="search_form">   */}
{/* 
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
                        </div> */}
                    {/* </form> */}
                {/* </div> */}
                {/* <br> */}
                {/* <slot name="utility_price"></slot> */}
                {/* <scrolling-table :table_data="table_data" :table_actions='table_action'></scrolling-table> */}
            </div>
        ); 
    }
}