Vue.component
(
    "add-invoice", 
    {
        mixins: [invoices_mixin], 
        methods: 
        {
            Submit(invoices)
            {
                let url = "server/invoice_controller/post.php?action=Import"; 
                let result = this.SubmitData("invoices", url, invoices); 
                if(Number(result))
                {
                    alert("Add Invoice Success!"); 
                    this.ResetValue({value_name: "user_input", new_value: R.clone(this.user_input)}); 
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
                <template v-if="invoice.leaseagrm_id" slot="invoice_information" slot-scope="{ invoice, invoice_information }">
                    <hr>
                    <div class="row">
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

Vue.component
(
    "edit-invoice", 
    {
        mixins: [invoices_mixin], 
        data: ()=>({edit_data: undefined}), 
        created() 
        {
            let invoice = this.TableData(this.CurrentController, {id: this.ObjectId, edit: 1}); 
            let invoice_details = this.AjaxRequest(`${this.main_url}InvoiceDetails&invoice_id=${this.ObjectId}`); 
            this.EditData(invoice[0], JSON.parse(invoice_details)); 
        },
        methods: 
        {
            EditData(invoice, invoice_details)
            {
                MultiSelectValues = (details_part)=>
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
                        let row = R.clone(this.user_input.invoice_details.leaseagrm.form); 
                        if(element.revenue_type_id==this.user_input.rent_id)
                        {
                            row[0].date_data.big_date.lock = Boolean(element["end_date"]); 
                        }
                        element["row"] = row; 
                    } 
                );

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
            Submit(invoice)
            {
                new Promise
                (
                    (resolve, reject)=>
                    {
                        let data = 
                        {
                            edit_data: this.edit_data, 
                            new_data: invoice 
                        }
                        let url = "server/invoice_controller/post.php?action=Update";
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
            }
        },
        template: 
        `
            <user-input-invoice @invoice-submit="Submit" v-if="edit_data" v-bind="$data">
                <template #title>Edit Invoice</template>
            </user-input-invoice>
        `
    }
); 