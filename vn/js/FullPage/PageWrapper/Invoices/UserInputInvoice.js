class UserInputInvoice extends React.Component 
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
    }
    BindObjectMultiSelect = (property) => 
    {
        var {edit_data, revenue_type, user_input} = this.props; 
        return {
            // name: `${property}_multi_select`, 
            select_value: "id", 
            text: "name", 
            value: JSON.stringify(this.state.list[property]), 
            SelectValueChanged: (value) => 
            {
                console.log(value); 
            }, 
            select_atributes: user_input.select_atributes, 
            select_data: revenue_type[property], 
            edit_data: _.get(edit_data, "multi_select")
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
                this.UpdateStateInvoiceDetail("leaseagrm_id", undefined); 
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
            leaseagrm_id => this.UpdateStateInvoiceDetail
            (
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
            onChange: (event)=> this.UpdateStateInvoiceDetail(invoice_property, event.target.value)
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
    UpdateStateInvoiceDetail = (invoice_property, value, extra_invoice_update = (invoice)=>null) => 
    {
        var invoice = ImmutabilityHelper
        (
            this.state.invoice, 
            {
                [invoice_property]: {$set: value}
            }
        ); 
        extra_invoice_update(invoice); 
        this.setState({invoice}); 
    }
    render()
    {
        let {edit_data, leaseagrm_select_data, main_url, revenue_type, title, user_input, InvoiceInformation} = this.props; 
        var invoice_details = this.InvoiceDetails(); 
        let {Container, Grid, TextField} = MaterialUI; 
        return (
            <Container>
                <h1>{title}</h1>
                <br />
                <div>
                    <SelectInput 
                        {...user_input.leaseagrm_id} 
                        select_data={leaseagrm_select_data}
                        lock={edit_data}
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
                        </React.Fragment>
                    )
                }
            </Container>
        ); 
    }
}