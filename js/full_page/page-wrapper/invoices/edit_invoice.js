Vue.component
(
    "edit-invoice", 
    {
        mixins: [invoices_mixin], 
        data() 
        {
            return {
                edit_data: undefined, 
            }
        },
        created() 
        {
            let invoice = this.TableData(this.CurrentController, {id: this.ObjectId, edit: 1}); 
            invoice = invoice[0]; 
            let invoice_details = this.AjaxRequest(`${this.user_input.main_url}InvoiceDetails&invoice_id=${this.ObjectId}`); 
            invoice_details = JSON.parse(invoice_details); 
            
            invoice_details.leaseagrm.forEach
            (
                element =>
                {
                    element["display"] = true; 
                    element["valid"] = true; 
                    let row = R.clone(this.user_input.invoice_details.leaseagrm.form); 
                    if(element.revenue_type_id==this.user_input.rent_id)
                    {
                        row[0].date_data.big_date.lock = Boolean(element["end_date"]); 
                    }
                    element["row"] = row; 
                } 
            );

            MultiSelectValues = (details_part)=>
            {
                let values = invoice_details[details_part].map(detail=>Number(detail.revenue_type_id)); 
                return JSON.stringify([...new Set(values)]); 
            }; 


            this.edit_data = 
            {
                invoice: invoice, 
                details: invoice_details, 
                multi_select: 
                {
                    leaseagrm_multi_select: MultiSelectValues("leaseagrm"), 
                    utilities_multi_select: MultiSelectValues("utilities")
                }
            }; 
        },
        methods: 
        {
            Submit(invoice)
            {
                let data = 
                {
                    edit_data: this.edit_data, 
                    new_data: invoice 
                }
                let url = "server/invoice_controller/update.php";
                let result = this.SubmitData("invoices", url, data); 
                console.log(result); 
            }
        },
        template: 
        `
            <user-input-invoice @invoice-submit="Submit" v-if="edit_data" v-bind="$data">
                <template #title>Edit Invoice</template>
                <template slot="invoice_information" slot-scope="{ invoice }">
                    <b>{{invoice}}</b>
                </template>
            </user-input-invoice>
        `
    }
); 