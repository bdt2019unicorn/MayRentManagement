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
                this.InvoiceInformation(value); 
                this.setState
                (
                    {
                        leaseagrm_id: undefined, 
                        invoice_details: this.StateObjectEmpty("invoice_details", []), 
                        list: this.StateObjectEmpty("list", []) 
                    }
                ); 
                resolve(value);  
            }
        ).then 
        (
            leaseagrm_id=>
            {
                var invoice = ImmutabilityHelper
                (
                    this.state.invoice, 
                    {
                        leaseagrm_id: {$set: leaseagrm_id}
                    }
                ); 
                if(!this.props.edit_data)
                {
                    invoice.name = `${this.state.invoice_information.tenant_name}_${this.DateReformatDisplay()}`; 
                    invoice.note = undefined; 
                }
                this.setState({invoice}); 
            }
        ); 
    } 
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
    render()
    {
        let {edit_data, leaseagrm_select_data, main_url, revenue_type, title, user_input} = this.props; 
        console.log(this.props); 
        return (
            <MaterialUI.Container>
                <h1>{title}</h1>
                <br />
                <div>
                    <SelectInput 
                        {...user_input.leaseagrm_id} 
                        select_data={leaseagrm_select_data}
                        lock={edit_data}
                        edit_data={edit_data?edit_data.invoice: undefined}
                        ValueChange={}
                    />
                </div>
            </MaterialUI.Container>
        ); 
    }
}