class UtilitiesOverview extends Utilities
{
    constructor(props)
    {
        super(props); 
        var add_price = ServerJson("../server/json/utilities_add_price/vn.json"); 
        add_price.form[0][0]["select_data"] = this.state.select_data.utilities; 
        this.add_price_form = add_price; 
        this.state = 
        {
            ...this.state, 
            add_price_form: false, 
            current_price: undefined, 
            revenue_type_id: undefined,
            valid_price_date: undefined
        }; 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if(this.state.revenue_type_id!=previous_state.revenue_type_id)
        {
            this.PriceInformation(); 
        }   
        if(this.state.add_price_form!=previous_state.add_price_form)
        {
            if(Boolean(this.state.add_price_form))
            {
                this.table_data_temp = _.cloneDeep(this.state.table_data); 
                this.setState({table_data: []}); 
            }
            else 
            {
                this.setState({table_data: this.table_data_temp}); 
            }
        }
    }
    CurrentPriceInformation = (revenue_type_id) => ServerJson(`${this.state.main_url}CurrentPrice&revenue_type_id=${revenue_type_id}`)[0]
    NewPrice = (data) => 
    {
        let current_price = this.CurrentPriceInformation(data.revenue_type_id); 
        let data_date_valid = moment(data.date_valid, DateReformat.Formats.DateDisplay); 
        var current_price_date_valid = data_date_valid; 
        try 
        {
            current_price_date_valid= moment(current_price.date_valid); 
        }
        catch (exception) {}

        if(data_date_valid<current_price_date_valid)
        {
            alert(`Vui lòng nhập ngày có hiệu lực lơn hơn ngày hiện tại ${DateReformat.Display(current_price_date_valid)}`); 
        }
        else
        {
            data.date_enter = DateReformat.Database(); 
            data.date_valid = DateReformat.Database(data_date_valid); 
            let url = `${this.state.main_url}NewPrice`; 
            let result = SubmitData("NewPrice", url, data); 
            if(Number(result))
            {
                alert("Giá mới đã được thêm vào hệ thống"); 
                this.setState({add_price_form: false}); 
                this.PriceInformation(); 
            }
            else 
            {
                alert("Đã có lỗi hệ thống. Vui lòng thử lại"); 
            }
        }
    }  
    PriceInformation = () => 
    {
        try 
        {
            let price_information = this.CurrentPriceInformation(this.state.revenue_type_id); 
            this.setState
            (
                {
                    current_price: price_information.value, 
                    valid_price_date: DateReformat.Display(price_information.date_valid) 
                }
            ); 
        }
        catch (exception) 
        {
            this.setState 
            (
                {
                    current_price: undefined, 
                    valid_price_date: undefined
                }
            ); 
        }
    }
    Search = (search_data, search_button=false) => 
    {
        if(search_button)
        {
            this.setState
            (
                {
                    table_data: undefined, 
                    revenue_type_id: search_data.get("revenue_type_id")
                }, 
                () => this.setState 
                (
                    {
                        table_data: JSON.parse(AjaxRequest(this.OverviewUrl(), search_data,"post"))
                    }
                )
            ); 
        }
    }
    UtilityNameSearchById = () => 
    {
        let utility_name_by_id = {}; 
        this.state.select_data.utilities.forEach
        (
            element => 
            {
                utility_name_by_id[element.id] = element.name; 
            }
        );
        return utility_name_by_id; 
    }
    render()
    {
        var { Button, Grid, Modal } = MaterialUI; 
        const space_submit_button = 3; 
        let utility_name_by_id = this.UtilityNameSearchById(); 
        return (
            <GeneralUtilities 
                current_building={this.props.current_building}
                select_data={this.state.select_data}
                table_data={this.state.table_data}
                SearchDataChanged={this.Search}
                FormUnitsSelect=
                {
                    <React.Fragment>
                        <Grid item xs={4}>
                            <SelectInput 
                                select_data={_.get(this.state.select_data, "units")}
                                {...this.state.select_data}
                                name="unit_id" 
                                title="Toàn bộ đơn vị"
                            />
                        </Grid>
                        <Grid item xs={space_submit_button}>
                            <div className="width-full mt-4 mb-4 ml-3 mr-0 pl-3 pr-3">
                                <Button type="submit" variant="contained" color="primary">Tìm kiếm</Button>
                            </div>
                        </Grid>
                    </React.Fragment>
                }
                UtilityOverview=
                {
                    <Grid item xs={space_submit_button}>
                        <br />
                    </Grid>
                }
                UtilityPrice=
                {
                    <React.Fragment>
                        <h4>Giá {utility_name_by_id[this.state.revenue_type_id]}</h4>
                        <Grid container spacing={1}>
                            <Grid item xs={10} container spacing={1}>
                                <Grid item xs={5}>
                                    <b>Current: </b>
                                    {this.state.current_price}
                                </Grid>
                                <Grid item xs={5}>
                                    <b>Valid from: </b>
                                    {this.state.valid_price_date}
                                </Grid>
                            </Grid>
                            {
                                this.props.user_permissions.DataEntry && 
                                (
                                    <Grid item xs={2}>
                                        <ActionButton
                                            title="Nhập giá hiện tại"
                                            icon="add_circle"
                                            ActionButtonClick={() => this.setState({add_price_form: _.cloneDeep(this.add_price_form)})}
                                        />
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Modal disableEnforceFocus open={Boolean(this.state.add_price_form)}>
                            <div className="popup-div">
                                <CloseButton onClick={()=>this.setState({add_price_form: false})} />
                                <UserInput 
                                    form={this.state.add_price_form} 
                                    ClearButton=
                                    {
                                        () => this.ResetStateValue
                                        (
                                            {
                                                value_name: "add_price_form", 
                                                new_value: _.cloneDeep(this.add_price_form)
                                            }
                                        )
                                    }
                                    FormSubmitValid={this.NewPrice} 
                                />
                            </div>
                        </Modal>
                        <h4>Tổng quan</h4>
                    </React.Fragment>
                }
            />
        ); 
    }
}

class UnitUtilities extends Utilities 
{
    Search = (search_data) => 
    {
        try 
        {
            search_data.append("unit_id", this.ObjectId()); 
            let unit_utitlities_json = AjaxRequest(this.OverviewUrl(), search_data,"post"); 
            let unit_utitlities = JSON.parse(unit_utitlities_json)[0]; 
            this.setState({table_data: Object.values(unit_utitlities.unit_table).reverse()}); 
        }
        catch (exception) {}
    }
    render()
    {
        return (
            <GeneralUtilities select_data={this.state.select_data} table_data={this.state.table_data} unit_id={this.ObjectId()} SearchDataChanged={this.Search} />
        ); 
    } 
}