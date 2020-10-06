Vue.component
(
    "add-invoice", 
    {
        mixins: [invoices_mixin], 
        methods: 
        {
            Submit(invoices)
            {
                let url = "server/invoice_controller/import.php"; 
                let result = this.SubmitData("invoices", url, invoices); 
                if(Number(result))
                {
                    alert("Add Invoice Success!"); 
                    new Promise
                    (
                        (resolve, reject)=>
                        {
                            let user_input = R.clone(this.user_input); 
                            this.user_input = undefined; 
                            resolve(user_input); 
                        }
                    ).then
                    (
                        (user_input)=>
                        {
                            this.user_input = user_input; 
                        }
                    ); 
                }
                else
                {
                    alert("Add Invoice Fails! Please try again"); 
                }
            }
        }, 
        template: 
        `
            <user-input-invoice v-if="user_input" @invoice-submit="Submit" v-bind="$data">
                <template #title>Add New Invoice</template>
                <template slot="invoice_information" slot-scope="{ invoice, invoice_information }">
                    <hr>
                    <div v-if="invoice.leaseagrm_id" class="row">
                        <div class="col text-center">
                            <p><b>Total</b></p>
                            <p>{{NumeralFormat(Number(invoice_information.leaseagrm.total_amount)||0)}}</p>
                        </div>
                        <div class="col text-center">
                            <p><b>Paid</b></p>
                            <p>{{NumeralFormat(Number(invoice_information.leaseagrm.paid_amount)||0)}}</p>
                        </div>
                        <div class="col text-center">
                            <p><b>Difference</b></p>
                            <p>{{NumeralFormat(Number(invoice_information.leaseagrm.difference)||0)}}</p>
                        </div>
                    </div>
                </template>
            </user-input-invoice>
        `
    }
); 