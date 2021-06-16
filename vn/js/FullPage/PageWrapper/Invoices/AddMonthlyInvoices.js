class AddMonthlyInvoices extends PageWrapperChildrenComponent 
{
    constructor(props) 
    {
        super(props); 
        this.user_input = ServerJson("../server/json/user_input/vn/invoice.json"); 
        this.rent_invoice = new RentInvoice(); 
        this.state =
        {
            expanded: undefined, 
            monthly_invoices: this.MonthlyInvoices(), 
            title: "Thêm hóa đơn tháng" 
        }; 
        this.monthly_invoices_display = this.MonthlyInvoicesDisplay(); 
    }

    MonthlyInvoices = () => 
    {
        var url = `${this.user_input.main_url}AddMonthlyInvoices&building_id=${this.BuildingId()}`; 
        return ServerJson(url); 
    }
    MonthlyInvoicesDisplay = (state_monthly_invoices=undefined) => 
    {
        try 
        {
            let monthly_invoices = {}; 
            state_monthly_invoices = state_monthly_invoices || this.state.monthly_invoices; 
            Object.keys(state_monthly_invoices).forEach
            (
                leaseagrm_id=>
                {
                    var monthly_invoice = 
                    {
                        leaseagrm: this.rent_invoice.PopulateRentInformation
                        (
                            {
                                revenue_type: 
                                {
                                    id: this.user_input.rent_id, 
                                    name: state_monthly_invoices[leaseagrm_id].revenue_types[this.user_input.rent_id]
                                }, 
                                price: state_monthly_invoices[leaseagrm_id].rent_amount, 
                                rent_information: state_monthly_invoices[leaseagrm_id].leaseagrm, 
                                leaseagrm_period: state_monthly_invoices[leaseagrm_id].leaseagrm_period, 
                                user_input: this.user_input, 
                                leaseagrm_id: leaseagrm_id
                            }
                        ), 
                        utilities: state_monthly_invoices[leaseagrm_id].utilities.map
                        (
                            utility=>
                            (
                                {
                                    ...utility, 
                                    name: `${state_monthly_invoices[leaseagrm_id].unit_name} - ${state_monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]} ${DateReformat.Display(utility.previous_date)}`, 
                                    revenue_type: state_monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]
                                }
                            )
                        )
                    }; 
                    var total = [...monthly_invoice.leaseagrm, ...monthly_invoice.utilities].reduce((accumulator, current_value)=>(accumulator + Number(current_value.amount.toString().replaceAll(",",""))), 0); 
                    
                    if(total)
                    {
                        monthly_invoices[leaseagrm_id] = {total, ...monthly_invoice}; 
                    }
                }
            ); 
            return monthly_invoices; 
        }   
        catch (exception) 
        {
            return {}; 
        } 
    }  
    MonthlyInvoicesSubmit = () => 
    {
        try 
        {
            let monthly_invoices = Object.keys(this.monthly_invoices_display).map
            (
                leaseagrm_id=>
                (
                    {
                        invoice: 
                        {
                            name: this.state.monthly_invoices[leaseagrm_id].name, 
                            leaseagrm_id: leaseagrm_id
                        }, 
                        details: 
                        {
                            leaseagrm: ValidInvoiceDetails.Leaseagrm(this.monthly_invoices_display[leaseagrm_id].leaseagrm), 
                            utilities: ValidInvoiceDetails.Utilities(this.monthly_invoices_display[leaseagrm_id].utilities)
                        }
                    }
                ) 
            ).map 
            (
                ({invoice, details})=>
                (
                    {
                        invoice: invoice, 
                        details: details, 
                        total_details: Object.values(details).reduce((accumulator, current_value)=>(accumulator + current_value.length), 0)
                    }
                )
            ).filter(({total_details})=>total_details); 
            return monthly_invoices.length? monthly_invoices: false; 
        }   
        catch (exception)
        {
            return false; 
        } 
    }
    Submit = () => 
    {
        var monthly_invoices_submit = this.MonthlyInvoicesSubmit(); 
        if(!monthly_invoices_submit)
        {
            alert("Đã có hóa đơn lỗi, vui lòng thử lại"); 
            return; 
        }
        let url = "../server/controller/invoice/post.php?command=AddMonthlyInvoices"; 
        let result = SubmitData("monthly_invoices", url, monthly_invoices_submit);
        if(Number(result))
        {
            alert(`${this.state.title} thành công!`); 
            var state_monthly_invoices = this.MonthlyInvoices(); 
            this.monthly_invoices_display = this.MonthlyInvoicesDisplay(state_monthly_invoices); 
            this.setState({monthly_invoices: state_monthly_invoices, expanded: undefined}); 
        }
        else 
        {
            alert(`${this.title} thất bại! Vui lòng thử lại`); 
        }
    }   
    render()
    {
        var { Accordion, AccordionDetails, AccordionSummary, Grid } = MaterialUI; 
        var monthly_invoices_display_keys = Object.keys(this.monthly_invoices_display); 
        return (
            <div>
                <h1>{this.state.title}</h1>
                {
                    monthly_invoices_display_keys.length ? 
                    (
                        <React.Fragment>
                            {
                                monthly_invoices_display_keys.map 
                                (
                                    leaseagrm_id => 
                                    <Accordion 
                                        key={leaseagrm_id}
                                        expanded={this.state.expanded==leaseagrm_id}
                                        onChange={(event, is_expanded)=>this.setState({expanded: is_expanded?leaseagrm_id: undefined})}
                                    >
                                        <AccordionSummary>
                                            <h5 className="text-blue">{this.state.monthly_invoices[leaseagrm_id].name}</h5>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div>
                                                <h6 className="text-right">{this.state.monthly_invoices[leaseagrm_id].leaseagrm_name}</h6>
                                                <hr />
                                                {
                                                    Boolean(this.monthly_invoices_display[leaseagrm_id].leaseagrm.length) && 
                                                    (
                                                        <div>
                                                            <h6>Tiền thuê</h6>
                                                            {
                                                                this.monthly_invoices_display[leaseagrm_id].leaseagrm.map 
                                                                (
                                                                    (rent, index)=>
                                                                    <LeaseagrmRow 
                                                                        key={index}
                                                                        revenue_type={rent}
                                                                        user_input={this.user_input}
                                                                        ValueChange=
                                                                        {
                                                                            ({name, value}) => this.monthly_invoices_display = ImmutabilityHelper 
                                                                            (
                                                                                this.monthly_invoices_display, 
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
                                                    Boolean(this.monthly_invoices_display[leaseagrm_id].utilities.length) && 
                                                    (
                                                        <div>
                                                            <h6>Tiện ích</h6>
                                                            {
                                                                this.monthly_invoices_display[leaseagrm_id].utilities.map 
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