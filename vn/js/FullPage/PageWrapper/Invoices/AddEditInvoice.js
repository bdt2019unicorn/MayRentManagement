class AddInvoice extends Invoices
{
    render()
    {
        return this.state.user_input ?
        (
            <UserInputInvoice title="Thêm Hóa Đơn" {...this.state}>

            </UserInputInvoice>
        ): null;  
    }
}