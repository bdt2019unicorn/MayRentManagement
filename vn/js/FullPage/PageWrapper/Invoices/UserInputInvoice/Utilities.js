class UtilitiesRow extends React.Component 
{
    render()
    {
        var { amount, date, name, number, previous_date, previous_number, price, quantity, revenue_type } = this.props; 
        var Grid = MaterialUI.Grid; 
        return (
            <div>
                <br />
                <h5 className="text-center">{revenue_type}</h5>
                <Grid container spacing={1}>
                    <Grid item xs={10}><h6>{name}</h6></Grid>
                    <Grid item xs={2} className="text-right"><h6>{amount}</h6></Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={3}><b>{DateReformat.Display(previous_date)}</b></Grid>
                    <Grid item xs={3}><b>{DateReformat.Display(date)}</b></Grid>
                    <Grid item xs={3}><b>Giá tiền</b></Grid>
                    <Grid item xs={3}><b>Số lượng</b></Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={3}>{previous_number}</Grid>
                    <Grid item xs={3}>{number}</Grid>
                    <Grid item xs={3}>{price}</Grid>
                    <Grid item xs={3}>{quantity}</Grid>
                </Grid>
                <hr />
            </div>
        ); 
    }
}

class InvoiceUtilities extends UserInputInvoiceComponent
{
    PopulateList = (value) => 
    {
        var {edit_data, invoice_information, revenue_type} = this.props; 
        let revenue_type_ids = value.map(revenue_type=>revenue_type.id); 
        var InvoiceInformationDetails = ()=>
        {
            return invoice_information.utilities.filter(details=>revenue_type_ids.includes(details.revenue_type_id)).map
            (
                (details)=>
                {
                    let revenue_type_name = revenue_type.utilities.find(revenue_type=>revenue_type.id == details.revenue_type_id).name; 
                    return {
                        name: `${invoice_information.unit_name} - ${revenue_type_name} ${DateReformat.Display(details.previous_date)} - ${DateReformat.Display(details.date)}`, 
                        revenue_type: revenue_type_name, 
                        ...details, 
                        ...["previous_number", "number", "price", "quantity", "amount"].reduce
                        (
                            (accumulator, current_value)=> 
                            (
                                {
                                    ...accumulator, 
                                    [current_value]: Number(details[current_value])
                                }
                            ), {}
                        )
                    }
                }
            ); 
        }; 
        if(edit_data)
        {
            let details_utilities = this.state.invoice_details.filter(details=>revenue_type_ids.includes(details.revenue_type_id)); 

            let edit_ids = details_utilities.map(detail=>detail.edit_id); 
            let edit_data_utilities = edit_data.details.utilities.filter(detail=>(!edit_ids.includes(detail.edit_id)) && (revenue_type_ids.includes(detail.revenue_type_id))); 

            let invoice_information_details = InvoiceInformationDetails(); 
            this.setState({invoice_details: [...details_utilities, ...edit_data_utilities, ...invoice_information_details]}); 
        }
        else 
        {
            this.setState({invoice_details: InvoiceInformationDetails()}); 
        }
    }
    ValidInvoiceDetails = () => ValidInvoiceDetails.Utilities(this.state.invoice_details, this.props.list)
    render()
    {
        return this.state.invoice_details.length?  
        (
            <div className="m-3">
                <h4>Tiện ích</h4>
                {this.state.invoice_details.map((revenue_type, index) => <UtilitiesRow key={index} {...revenue_type} />)}
            </div>
        ): null;
    }
} 