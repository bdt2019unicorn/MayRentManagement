Vue.component
(
    "edit-invoice", 
    {
        mixins: [invoices_mixin], 
        data() 
        {
            return {
                edit_data: undefined, 
                user_input_invoice: false 
                 
            }
        },
        created() 
        {
            let invoice = this.TableData(this.CurrentController, {id: this.ObjectId, edit: 1}); 
            // console.log(invoice); 
            // this.invoice = invoice[0]; 
            let invoice_details = this.AjaxRequest(`${this.user_input.main_url}InvoiceDetails&invoice_id=${this.ObjectId}`); 
            // console.log(invoice_details); 
            // invoice_details = JSON.parse(invoice_details); 
            // console.log(invoice_details); 
            // this.invoice_details = invoice_details; 


            this.edit_data = 
            {
                invoice: invoice, 
                details: JSON.parse(invoice_details)
            }; 
        },
        template: 
        `
            <div>
                <user-input-invoice v-if="user_input_invoice"></user-input-invoice>
            </div>
        `
    }
); 