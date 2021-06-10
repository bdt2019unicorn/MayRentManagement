class AddInvoice extends Invoices
{
    render()
    {
        let Grid = MaterialUI.Grid; 
        return this.state.user_input ?
        (
            <UserInputInvoice 
                title="Thêm Hóa Đơn" 
                {...this.state} 
                InvoiceInformation=
                {
                    (invoice, invoice_information)=> invoice.leaseagrm_id ? 
                    (
                        <React.Fragment>
                            <hr />
                            <Grid container spacing={1}>
                                <Grid className="text-center" item xs={4}>
                                    <p><b>Total</b></p>
                                    <p>{NumeralFormat(Number(invoice_information.leaseagrm.total_amount)||0)}</p>
                                </Grid>
                                <Grid className="text-center" item xs={4}>
                                    <p><b>Paid</b></p>
                                    <p>{NumeralFormat(Number(invoice_information.leaseagrm.paid_amount)||0)}</p>
                                </Grid>
                                <Grid className="text-center" item xs={4}>
                                    <p><b>Difference</b></p>
                                    <p>{NumeralFormat(Number(invoice_information.leaseagrm.difference)||0)}</p>
                                </Grid>
                            </Grid>
                        </React.Fragment>

                    ): null 
                }
                InvoiceSubmit=
                {
                    (invoices) => 
                    {
                        let url = "../server/controller/invoice/post.php?command=Import"; 
                        let result = SubmitData("invoices", url, invoices); 
                        if(Number(result))
                        {
                            alert("Thêm hóa đơn thành công"); 
                            this.ResetStateValue({value_name: "user_input", new_value: _.cloneDeep(this.state.user_input)}); 
                        }
                        else
                        {
                            alert("Thêm hóa đơn thất bại. Vui lòng thử lại"); 
                        }
                    }
                }
            />
        ): null;  
    }
}

class EditInvoice extends Invoices 
{
    constructor(props) 
    {
        super(props); 
        this.state = {...this.state, edit_data: undefined}; 
    } 
    componentDidMount()
    {
        var object_id = this.ObjectId(); 
        let invoice = this.TableData(this.CurrentController(), {id: object_id, edit: 1}); 
        let invoice_details = AjaxRequest(`${this.state.main_url}InvoiceDetails&invoice_id=${object_id}`); 
        this.EditData(invoice[0], JSON.parse(invoice_details)); 
    }
    EditData = (invoice, invoice_details) => 
    {
        var MultiSelectValues = (details_part)=>
        {
            let values = invoice_details[details_part].map(detail=>Number(detail.revenue_type_id)); 
            return JSON.stringify([...new Set(values)]); 
        }; 

        invoice_details.leaseagrm.forEach
        (
            element =>
            {
                element["display"] = true; 
                element["valid"] = true; 
                let row = _.cloneDeep(this.state.user_input.invoice_details.leaseagrm.form); 
                if(element.revenue_type_id==this.state.user_input.rent_id)
                {
                    row[0].date_data.big_date.lock = Boolean(element["end_date"]); 
                }
                element["row"] = row; 
            } 
        );

        this.setState
        ( 
            {
                edit_data: 
                {
                    invoice: invoice, 
                    details: invoice_details, 
                    multi_select: 
                    {
                        leaseagrm_multi_select: MultiSelectValues("leaseagrm"), 
                        utilities_multi_select: MultiSelectValues("utilities")
                    }
                }
            }
        ); 
    }
    render()
    {
        return this.state.edit_data ? 
        <UserInputInvoice 
            title="Chỉnh sửa hóa đơn" 
            {...this.state}
            InvoiceSubmit = 
            {
                (invoices) => 
                {
            /*
                    new Promise
                    (
                        (resolve, reject)=>
                        {
                            let data = 
                            {
                                edit_data: this.edit_data, 
                                new_data: invoices
                            }
                            let url = "server/controller/invoice/post.php?command=Update";
                            let result = this.SubmitData("invoices", url, data); 
                            var new_edit_data = undefined; 
                            try 
                            {
                                new_edit_data = JSON.parse(result); 
                                alert("Edit invoice success!"); 
                                
                            }
                            catch 
                            {
                                alert("Edit invoice fails, please try again later"); 
                                reject(); 
                            }
                            resolve(new_edit_data); 
                        }
                    ).then
                    (
                        new_edit_data=>
                        {
                            return new Promise
                            (
                                (resolve, reject)=>
                                {
                                    if(new_edit_data)
                                    {
                                        this.edit_data = undefined; 
                                        resolve(new_edit_data); 
                                    }
                                    reject(); 
                                }
                            ); 
            
                        }
                    ).then(new_edit_data=>this.EditData(new_edit_data.invoice, new_edit_data.details)); 

            */
                }
            }
        />: null; 
    }
}