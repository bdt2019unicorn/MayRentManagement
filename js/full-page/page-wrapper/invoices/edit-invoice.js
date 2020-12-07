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
                        let url = "server/invoice_controller/update.php";
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
                                this.edit_data = undefined; 
                                    this.edit_data = undefined; 
                                    resolve(new_edit_data); 
                                resolve(new_edit_data); 
                                    resolve(new_edit_data); 
                                }
                                reject(); 
                            reject(); 
                                reject(); 
                            }
                        ); 

                    }
                ).then 
                (
                    new_edit_data=>
                    {
                        this.EditData(new_edit_data.invoice, new_edit_data.details); 
                    }
                ); 
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