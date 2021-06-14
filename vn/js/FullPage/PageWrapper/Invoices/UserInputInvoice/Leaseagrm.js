class LeaseagrmRow extends React.Component 
{
    render()
    {
        var {revenue_type, user_input, ValueChange} = this.props; 
        var {Grid} = MaterialUI; 
        var grid_xs = 12 / revenue_type.row.length; 
        return (
            <div>
                <br />
                {
                    revenue_type.display && 
                    (
                        <form>
                            <Grid container spacing={1}>
                                <Grid item xs={7}>
                                    <TextInput edit_data={revenue_type} name="name" ValueChange={({value})=> ValueChange({name: "name", value})} />
                                </Grid>
                                <Grid item xs={3} className="text-center"><h5>{revenue_type.title}</h5></Grid>
                                <Grid item xs={2} className="text-right"><b>{NumeralFormat(revenue_type.amount)}</b></Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                {
                                    revenue_type.row.map 
                                    (
                                        (row, index)=> 
                                        {
                                            var Component = window[row.component]; 
                                            return (
                                                <Grid key={index} item xs={grid_xs}>
                                                    <Component 
                                                        {...row}
                                                        edit_data={revenue_type}
                                                        lock={Number(revenue_type.revenue_type_id)==user_input.rent_id?user_input.invoice_details.leaseagrm.rent_lock:undefined}
                                                        ValueChange={ValueChange}
                                                    />
                                                </Grid>
                                            ); 
                                        }
                                    )
                                }
                            </Grid>
                        </form>
                    )
                }
                <hr />
            </div>
        ); 
    }
}

class InvoiceLeaseagrm extends UserInputInvoiceComponent
{
    constructor(props)
    {
        super(props); 
        this.rent_invoice = props.rent_invoice || new RentInvoice(); 
    }
    PopulateList = (value) => 
    {
        var {edit_data, invoice_information, user_input} = this.props; 
        new Promise
        (
            (resolve, reject)=>
            {
                let revenue_type_ids = value.map(revenue_type=>revenue_type.id); 
                let leaseagrm_details = this.state.invoice_details.filter(details=>(revenue_type_ids.includes(details.revenue_type_id))); 
                this.setState({invoice_details: []}); 
                resolve(leaseagrm_details); 
            }
        ).then 
        (
            leaseagrm_details=>
            {
                let revenue_type_ids = leaseagrm_details.map(details=>details.revenue_type_id); 
                let additional_details = value.filter(revenue_type=>!revenue_type_ids.includes(revenue_type.id)).flatMap
                (
                    revenue_type=>
                    {
                        if(edit_data)
                        {
                            let details = edit_data.details.leaseagrm.filter(detail=>detail.revenue_type_id==revenue_type.id); 
                            if(details.length>0)
                            {
                                return _.cloneDeep(details); 
                            }
                        }

                        return (revenue_type.id==user_input.rent_id) ? 
                        this.rent_invoice.PopulateRentInformation
                        (
                            {
                                revenue_type,  
                                price: invoice_information.leaseagrm["rent_amount"], 
                                rent_information: invoice_information.leaseagrm["rent_information"], 
                                leaseagrm_end_date: invoice_information.leaseagrm["end_date"], 
                                user_input,  
                                leaseagrm_period: invoice_information.leaseagrm["leaseagrm_period"]
                            }
                        ): 
                        [
                            {
                                display: true, 
                                revenue_type_id: revenue_type.id, 
                                title: revenue_type.name, 
                                valid: true, 
                                start_date: invoice_information.leaseagrm["start_date"], 
                                end_date: invoice_information.leaseagrm["end_date"], 
                                price: 0, 
                                quantity: 1, 
                                name: `${revenue_type.name} (${DateReformat.Display(invoice_information.leaseagrm["start_date"])} - ${DateReformat.Display(invoice_information.leaseagrm["end_date"])})`, 
                                amount: 0, 
                                row: user_input.invoice_details.leaseagrm.form
                            }
                        ]; 
                    }
                );        
                this.setState
                (
                    {
                        invoice_details: [...leaseagrm_details, ...additional_details].sort
                        (
                            (a, b)=> ((a.revenue_type_id>b.revenue_type_id)?1: -1)
                        )
                    }
                ); 
            }
        ); 
    }
    ValidInvoiceDetails = () => ValidInvoiceDetails.Leaseagrm(this.state.invoice_details)
    render()
    {
        var {Grid} = MaterialUI; 
        var {invoice_information, user_input} = this.props; 
        return (
            <Grid container>
                <Grid item xs={12}>
                    <h4>Tiền thuê và chi phí khác</h4>
                    {
                        this.state.invoice_details.map 
                        (
                            (revenue_type, index) => 
                            <LeaseagrmRow 
                                key={index} 
                                user_input={user_input} 
                                revenue_type={revenue_type} 
                                ValueChange=
                                {
                                    ({name, value}) => 
                                    {
                                        var invoice_detail = { ...revenue_type, [name]: value};
                                        if(Number(revenue_type.revenue_type_id) == Number(user_input.rent_id))
                                        {
                                            invoice_detail.quantity = this.rent_invoice.RentQuantityCalculation(invoice_detail.start_date, invoice_detail.end_date, invoice_information.leaseagrm["leaseagrm_period"]); 
                                        }
                                        invoice_detail.amount = Number(invoice_detail.price) * Number(invoice_detail.quantity); 
                                        this.UpdateStateValueProperty("invoice_details", index, invoice_detail); 
                                    }
                                } 
                            />
                        )
                    }
                </Grid>
            </Grid>
        ); 
    }
}