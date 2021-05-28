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
            />
        ): null;  
    }
}