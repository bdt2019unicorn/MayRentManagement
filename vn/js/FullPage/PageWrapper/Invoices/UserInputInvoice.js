class UserInputInvoice extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            invoice: 
            {
                leaseagrm_id: undefined, 
                name: undefined, 
                note: undefined 
            }, 
            invoice_details: 
            {
                leaseagrm: [], 
                utilities: []
            }, 
            invoice_information: 
            {
                unit_name: undefined, 
                tenant_name: undefined, 
                leaseagrm: {}, 
                utilities: {}
            }, 
            list: 
            {
                leaseagrm: [], 
                utilities: []
            }
        }; 
        this.rent_invoice = new RentInvoice(); 
    }
    componentDidMount()
    {
        if(this.props.edit_data)
        {
            var edit_data = this.props.edit_data; 
            var multi_select = _.get(edit_data, "multi_select"); 
            var list = Object.keys(this.state.list).reduce
            (
                (accumulator, property) => ({ ...accumulator, [property]: JSON.parse(multi_select[`${property}_multi_select`])}), {}
            ); 
            // I think the issue is here. Need further investigate
            this.setState({list}, () => this.setState({invoice_details: _.get(edit_data, "details"), invoice: _.get(edit_data, "invoice")})); 
        }
    }
    BindObjectComponent = (property) => 
    (
        {
            ...this.props, 
            invoice_information: this.state.invoice_information, 
            list: this.state.list[property], 
            ValidInvoiceDetailsUpdate: (valid_invoice_details) => this.UpdateStateValueProperty("invoice_details", property, valid_invoice_details), 
            Unmount: () => this.UpdateStateValueProperty("invoice_details", property, [])
        }
    )
    BindObjectMultiSelect = (property) => 
    {
        var { revenue_type, user_input } = this.props; 
        return {
            select_value: "id", 
            text: "name", 
            value: JSON.stringify(this.state.list[property]), 
            SelectValueChanged: (value) => this.UpdateStateValueProperty
            (
                "list", 
                property, 
                value.map
                (
                    revenue_type_id => revenue_type[property].find(({id})=>id==revenue_type_id)
                )
            ),
            select_atributes: user_input.select_atributes, 
            select_data: revenue_type[property] 
        }; 
    } 
    InvoiceDetails = () =>
    {
        let invoice_complete = Object.keys(this.state.invoice).filter(key=>key!="note").map(key=>Boolean(this.state.invoice[key])); 
        return !invoice_complete.includes(false);  
    } 
    InvoiceInformation = (leaseagrm_id) => this.setState({invoice_information: ServerJson(`${this.props.main_url}InvoiceInformation&leaseagrm_id=${leaseagrm_id}`)})
    LeaseagrmIdSelectChanged = ({value}) => 
    {
        new Promise 
        (
            (resolve, reject)=>
            {
                this.UpdateStateValueProperty("invoice", "leaseagrm_id", undefined); 
                this.InvoiceInformation(value); 
                this.setState
                (
                    {
                        invoice_details: this.StateObjectEmpty("invoice_details", []), 
                        list: this.StateObjectEmpty("list", []) 
                    }
                ); 
                resolve(value);  
            }
        ).then 
        (
            leaseagrm_id => this.UpdateStateValueProperty
            (
                "invoice", 
                "leaseagrm_id", 
                leaseagrm_id, 
                (invoice) => 
                {
                    if(!this.props.edit_data)
                    {
                        invoice.name = `${this.state.invoice_information.tenant_name}_${DateReformat.Display()}`; 
                        invoice.note = undefined; 
                    }
                }
            ) 
        ); 
    } 
    ModelTextInputInvoice = (invoice_property) => 
    (
        {
            size: "medium", 
            fullWidth: true, 
            value: this.state.invoice[invoice_property] || "",  
            margin: "normal", 
            variant: "outlined", 
            onChange: (event)=> this.UpdateStateValueProperty("invoice", invoice_property, event.target.value)
        }
    )
    StateObjectEmpty = (state_name, empty_value) => Object.keys(this.state[state_name]).reduce
    (
        (accumulator, current_value)=> 
        (
            {
                ...accumulator, 
                [current_value]: empty_value
            }
        ), {}
    )
    ValidInvoiceDetails = () => 
    {
        if(ValidObject(this.state.invoice_details))
        {
            let total_details = Object.values(this.state.invoice_details).reduce((accumulator, current_value)=>(accumulator+ current_value.length),0); 
            return (total_details>0)?this.state.invoice_details: false; 
        }
        return false; 
    }
    render()
    {
        let {edit_data, leaseagrm_select_data, title, user_input, InvoiceInformation} = this.props; 
        var invoice_details = this.InvoiceDetails(); 
        var valid_invoice_details = this.ValidInvoiceDetails(); 
        let {Container, Grid, TextField} = MaterialUI; 
        return (
            <Container>
                <h1>{title}</h1>
                <br />
                <div>
                    <SelectInput 
                        {...user_input.leaseagrm_id} 
                        select_data={leaseagrm_select_data}
                        disabled={Boolean(edit_data)}
                        edit_data={edit_data?edit_data.invoice: undefined}
                        ValueChange={this.LeaseagrmIdSelectChanged}
                    />
                    <TextField {...this.ModelTextInputInvoice("name")} label="Tên Hợp Đồng" />
                    <TextField {...this.ModelTextInputInvoice("note")} label="Ghi chú" />
                </div>
                {InvoiceInformation && InvoiceInformation(this.state.invoice, this.state.invoice_information)}
                <hr />
                {
                    (edit_data || invoice_details) && 
                    (
                        <React.Fragment>
                            <h2>Chi tiết hóa đơn</h2>
                            <br />
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <MultiSelectValue title="Tiền thuê và chi phí khác" {...this.BindObjectMultiSelect("leaseagrm")} />
                                </Grid>
                                <Grid item xs={6}>
                                    <MultiSelectValue title="Tiện ích" {...this.BindObjectMultiSelect("utilities")} />
                                </Grid>
                            </Grid>
                            <br />
                            
                            {
                                Boolean(this.state.list.leaseagrm.length) && <InvoiceLeaseagrm {...this.BindObjectComponent("leaseagrm")} rent_invoice={this.rent_invoice} />
                            }

                            {
                                Boolean(this.state.list.utilities.length) && <InvoiceUtilities {...this.BindObjectComponent("utilities")} />
                            }
                        </React.Fragment>
                    )
                }
                {
                    Boolean(invoice_details && valid_invoice_details) && <SubmitButton type="button" SubmitButtonClick={()=>this.ExecPropsFunction("InvoiceSubmit", {invoice: this.state.invoice, details: this.state.invoice_details})} />
                }
            </Container>
        ); 
    }
}