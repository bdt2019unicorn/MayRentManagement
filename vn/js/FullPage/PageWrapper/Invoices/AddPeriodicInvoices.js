class AddPeriodicInvoices extends PageWrapperChildrenComponent 
{
    constructor(props) 
    {
        super(props); 
        this.user_input = ServerJson("../server/json/user_input/vn/invoice.json"); 
        this.rent_invoice = new RentInvoice(); 
        this.state =
        {
            expanded: undefined, 
            periodic_invoices: this.PeriodicInvoices(), 
            title: "Thêm hóa đơn định kì" 
        }; 
        this.periodic_invoices_display = this.PeriodicInvoicesDisplay(); 
    }
    PeriodicInvoices = () => 
    {
        let periodic_invoices = ServerJson(`${this.user_input.main_url}AddPeriodicInvoices&building_id=${this.BuildingId()}`) || {}; 
        let end_of_month = moment().endOf("month"); 
        for (const leaseagrm_id in periodic_invoices) 
        {
            let { lease_end, leaseagrm, leaseagrm_period, utilities } = periodic_invoices[leaseagrm_id]; 
            lease_end = moment(lease_end); 

            leaseagrm = leaseagrm.map 
            (
                ({start_date, end_date}) => 
                {
                    if(!end_date)
                    {
                        let new_end_date = _.cloneDeep(moment.min(lease_end, end_of_month)); 
                        let quantity = this.rent_invoice.RentQuantityCalculation(start_date, new_end_date, leaseagrm_period); 
                        if(quantity>1)
                        {
                            end_date = DateReformat.Database(new_end_date); 
                        }
                    }
                    return { start_date, end_date }; 
                }
            ).filter(({end_date})=>end_date); 

            if(_.isEmpty([...leaseagrm, ...utilities]))
            {
                delete periodic_invoices[leaseagrm_id]; 
            }
            else 
            {
                periodic_invoices[leaseagrm_id].leaseagrm = leaseagrm; 
            }
        }
        return periodic_invoices; 
    }
    PeriodicInvoicesDisplay = (state_periodic_invoices=undefined) => 
    {
        try 
        {
            let periodic_invoices = {}; 
            state_periodic_invoices = state_periodic_invoices || this.state.periodic_invoices; 
            for (const leaseagrm_id in state_periodic_invoices) 
            {
                let leaseagrm = this.rent_invoice.PopulateRentInformation
                (
                    {
                        revenue_type: 
                        {
                            id: this.user_input.rent_id, 
                            name: state_periodic_invoices[leaseagrm_id].revenue_types[this.user_input.rent_id]
                        }, 
                        price: state_periodic_invoices[leaseagrm_id].rent_amount, 
                        rent_information: state_periodic_invoices[leaseagrm_id].leaseagrm, 
                        leaseagrm_period: state_periodic_invoices[leaseagrm_id].leaseagrm_period, 
                        user_input: this.user_input, 
                        leaseagrm_id: leaseagrm_id
                    }
                ); 
                let utilities = state_periodic_invoices[leaseagrm_id].utilities.map
                (
                    utility=>
                    (
                        {
                            ...utility, 
                            name: `${state_periodic_invoices[leaseagrm_id].unit_name} - ${state_periodic_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]} ${DateReformat.Display(utility.previous_date)}`, 
                            revenue_type: state_periodic_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]
                        }
                    )
                ); 
                let total = [...leaseagrm, ...utilities].reduce((accumulator, current_value)=>(accumulator + Number(current_value.amount.toString().replaceAll(",",""))), 0); 
                if(total)
                {
                    periodic_invoices[leaseagrm_id] = 
                    {
                        leaseagrm, 
                        utilities,
                        total, 
                        leaseagrm_period: state_periodic_invoices[leaseagrm_id].leaseagrm_period
                    }; 
                }
            }
            return periodic_invoices; 
        }   
        catch (exception) 
        {
            return {}; 
        } 
    }  
    PeriodicInvoicesSubmit = () => 
    {
        try 
        {
            let periodic_invoices = []; 
            for (const leaseagrm_id in this.periodic_invoices_display) 
            {
                let leaseagrm = this.ValidInvoiceDetailsLeaseagrm(this.periodic_invoices_display[leaseagrm_id].leaseagrm); 
                let utilities = this.ValidInvoiceDetailsUtilities(this.periodic_invoices_display[leaseagrm_id].utilities); 
                if(!_.isEmpty(leaseagrm) || !_.isEmpty(utilities))
                {
                    periodic_invoices.push
                    (
                        {
                            invoice: 
                            {
                                name: this.state.periodic_invoices[leaseagrm_id].name, 
                                leaseagrm_id
                            }, 
                            details: {leaseagrm, utilities} 
                        }
                    ); 
                }
            }
            return _.isEmpty(periodic_invoices) ? false: periodic_invoices;
        }   
        catch (exception)
        {
            return false; 
        } 
    }
    Submit = () => 
    {
        var periodic_invoices_submit = this.PeriodicInvoicesSubmit(); 
        if(!periodic_invoices_submit)
        {
            alert("Đã có hóa đơn lỗi, vui lòng thử lại"); 
            return; 
        }
        let url = "../server/controller/invoice/post.php?command=AddPeriodicInvoices"; 
        let result = SubmitData("periodic_invoices", url, periodic_invoices_submit);
        if(Number(result))
        {
            alert(`${this.state.title} thành công!`); 
            var state_periodic_invoices = this.PeriodicInvoices(); 
            this.periodic_invoices_display = this.PeriodicInvoicesDisplay(state_periodic_invoices); 
            this.setState({periodic_invoices: state_periodic_invoices, expanded: undefined}); 
        }
        else 
        {
            alert(`${this.title} thất bại! Vui lòng thử lại`); 
        }
    }   
    render()
    {
        var { Accordion, AccordionDetails, AccordionSummary, Grid } = MaterialUI; 
        var periodic_invoices_display_keys = Object.keys(this.periodic_invoices_display); 
        return (
            <div>
                <h1>{this.state.title}</h1>
                {
                    !_.isEmpty(periodic_invoices_display_keys) ? 
                    (
                        <React.Fragment>
                            {
                                periodic_invoices_display_keys.map 
                                (
                                    leaseagrm_id => 
                                    <Accordion 
                                        key={leaseagrm_id}
                                        expanded={this.state.expanded==leaseagrm_id}
                                        onChange={(event, is_expanded)=>this.setState({expanded: is_expanded?leaseagrm_id: undefined})}
                                    >
                                        <AccordionSummary>
                                            <h5 className="text-blue">{this.state.periodic_invoices[leaseagrm_id].name}</h5>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="width-full">
                                                <h6 className="text-right">{this.state.periodic_invoices[leaseagrm_id].leaseagrm_name}</h6>
                                                <hr />
                                                {
                                                    !_.isEmpty(this.periodic_invoices_display[leaseagrm_id].leaseagrm) && 
                                                    (
                                                        <div>
                                                            <h6>Tiền thuê - Thời gian thu: {this.periodic_invoices_display[leaseagrm_id].leaseagrm_period}</h6>
                                                            {
                                                                this.periodic_invoices_display[leaseagrm_id].leaseagrm.map 
                                                                (
                                                                    (rent, index)=>
                                                                    <LeaseagrmRow 
                                                                        key={index}
                                                                        revenue_type={rent}
                                                                        user_input={this.user_input}
                                                                        ValueChange=
                                                                        {
                                                                            ({name, value}) => this.periodic_invoices_display = ImmutabilityHelper 
                                                                            (
                                                                                this.periodic_invoices_display, 
                                                                                {
                                                                                    [leaseagrm_id]: 
                                                                                    {
                                                                                        leaseagrm: 
                                                                                        {
                                                                                            [index]: 
                                                                                            {
                                                                                                [name]: {$set: value}
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            ) 
                                                                        } 
                                                                    />
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                                {
                                                    !_.isEmpty(this.periodic_invoices_display[leaseagrm_id].utilities) && 
                                                    (
                                                        <div>
                                                            <h6>Tiện ích</h6>
                                                            {
                                                                this.periodic_invoices_display[leaseagrm_id].utilities.map 
                                                                (
                                                                    (utilities, index) => <UtilitiesRow key={index} {...utilities} />
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            }
                            <section>
                                <SubmitButton type="button" title={this.state.title} SubmitButtonClick={this.Submit} />
                            </section>
                        </React.Fragment>
                    ): 
                    (
                        <div>
                            <br />
                            <Grid container justify="center">
                                <Grid item xs={6} className="border border-red">
                                    <h3 className="text-danger text-center">Toàn bộ hóa đơn tháng này đã được tạo</h3>
                                </Grid>
                            </Grid>
                        </div>
                    )
                }
            </div>
        ); 
    }
}