class GeneralUtilities extends GeneralUtilities 
{
    constructor(props)
    {
        super(props);
        let { current_building, select_data, unit_id } = props; 
        let revenue_type_id = _.get(select_data, "utilities.0.id"); 
        var start_date = AjaxRequest(`${this.state.main_url}SelectStartDate&revenue_type_id=${revenue_type_id}&${unit_id?`unit_id=${unit_id}`: `building_id=${current_building}`}`); 
        var end_date = moment().endOf('month').format(DateReformat.Formats.DateDatabase); 
        this.state = 
        {
            ...this.state, 
            end_date: new Date(end_date), 
            revenue_type_id, 
            start_date: new Date(start_date), 
            table_action: TableAction("utilities") 
        }; 
        this.search_form = React.createRef(); 
    } 
    componentDidMount()
    {
        this.Search(true); 
    } 
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
        try 
        {
            event.preventDefault(); 
        }
        catch (exception) {}
        var search_data = new FormData(this.search_form.current); 
        this.ExecPropsFunction("SearchDataChanged", search_data, Boolean(event)); 
    } 
    ThisMonthDayRange = () => 
    {
        this.start_date = this.AjaxRequest(`${this.main_url}SelectStartDate&revenue_type_id=${this.revenue_type_id}&${this.$route.query.id?`unit_id=${this.$route.query.id}`: `building_id=${this.$route.params.building_id}`}`); 
        this.end_date = moment().endOf('month').format('YYYY-MM-DD');
    }
    render()
    {
        var Grid = MaterialUI.Grid; 
        var { current_building, select_data, table_data, FormUnitsSelect, UtilityPrice } = this.props; 
        return (
            <div>
                <h1>Tiện ích</h1>
                <form ref={this.search_form} onSubmit={this.Search}>
                    <Grid container spacing={1}>
                        <Grid item xs={FormUnitsSelect ? 5 : 11}>
                            <SelectInput
                                select_data={select_data.utilities} 
                                {...select_data}
                                name="revenue_type_id" 
                                title="Loại tiện ích"
                                value={this.state.revenue_type_id}
                                ValueChange={({value})=>this.setState({revenue_type_id: value}, ()=>this.Search(false))}
                            />
                        </Grid>
                        { FormUnitsSelect || null }
                    </Grid>
                    <Grid container>
                        <Grid item xs={9}>
                            <RangeDatePicker
                                startDate={this.state.start_date}
                                endDate={this.state.end_date}
                                onChange={(start_date, end_date) => this.setState({start_date, end_date}, ()=>this.Search(false))}
                                dateFormat={DateReformat.Formats.Display}
                                monthFormat={DateReformat.Formats.MonthDisplay}
                                startDatePlaceholder="Ngày bắt đầu"
                                endDatePlaceholder="Ngày kết thúc"
                                highlightToday
                            />
                            <input type="text" name="start_date" value={DateReformat.Database(this.state.start_date)} readOnly hidden />
                            <input type="text" name="end_date" value={DateReformat.Database(this.state.end_date)} readOnly hidden />
                        </Grid>
                    </Grid>
                </form>
                <br />
                { UtilityPrice || null }
                {
                    Boolean(_.get(table_data, "length")) && 
                    <ScrollingTable append={current_building} table={table_data} table_actions={this.state.table_action} />
                }
            </div>
        ); 
    }
}