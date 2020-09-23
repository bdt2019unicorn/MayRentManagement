Vue.component
(
    "edit-invoice", 
    {
        mixins: [invoices_mixin], 
        created() 
        {
            let invoice = this.TableData(this.CurrentController, {id: this.ObjectId, edit: 1}); 
            console.log(invoice); 
            let invoice_details = this.AjaxRequest(`${this.user_input.main_url}InvoiceDetails&invoice_id=${this.ObjectId}`); 
            console.log(invoice_details); 
            invoice_details = JSON.parse(invoice_details); 
            console.log(invoice_details); 
        },
        template: 
        `
            <div>
            </div>
        `
    }
); 