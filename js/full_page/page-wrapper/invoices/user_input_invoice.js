Vue.component
(
    "user-input-invoice", 
    {
        props: ["edit_data", "revenue_type", "user_input"], 
        mixins:[support_mixin], 
        data() 
        {
            return {
                invoice: 
                {
                    leaseagrm_id: undefined, 
                    name: undefined
                }, 
                invoice_details: 
                {
                    leaseagrm: [], 
                    utilities: []
                }, 
                invoice_information: 
                {
                    apartment_name: undefined, 
                    leaseagrm: {}, 
                    utilities: {}
                }, 
                list: 
                {
                    leaseagrm: [], 
                    utilities: []
                }
            }; 
        },
        computed: 
        {
            InvoiceDetails()
            {
                let invoice_complete = Object.values(this.invoice).map(value=>Boolean(value));
                return !invoice_complete.includes(false);  
            }, 
            ValidInvoiceDetails()
            {
                if(this.ValidObject(this.invoice_details))
                {
                    let total_details = Object.values(this.invoice_details).reduce((accumulator, current_value)=>(accumulator+ current_value.length),0); 
                    return (total_details>0)?this.invoice_details: false; 
                }
                return false; 
            }
        }, 
        mounted() 
        {
            if(this.edit_data)
            {
                this.invoice = R.clone(this.edit_data.invoice);  
                this.invoice_details = R.clone(this.edit_data.details); 
                this.InvoiceInformation(this.edit_data.invoice.leaseagrm_id); 
                $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").val(this.edit_data.invoice.leaseagrm_id); 
            }
        },
        methods: 
        {
            BindObjectComponent(property)
            {
                return {
                    ...this.$props, 
                    invoice_information: this.invoice_information,
                    list: this.list[property],
                }
            }, 

            BindObjectMultiSelect(property)
            {
                let title = 
                {
                    leaseagrm: "Rent and other cost", 
                    utilities: "Utilities" 
                };
                return {
                    name: `${property}_multi_select`, 
                    title: title[property], 
                    select_atributes: this.user_input.select_atributes, 
                    select_data: this.revenue_type[property], 
                    edit_data: this.edit_data?this.edit_data.multi_select:undefined
                }
            }, 

            InputMultiSelect(property)
            {
                if(this.list[property].length==0)
                {
                    this.invoice_details[property] = []; 
                }
            }, 

            InvoiceInformation(leaseagrm_id)
            {
                let invoice_information = this.AjaxRequest(`${this.user_input.main_url}InvoiceInformation&leaseagrm_id=${leaseagrm_id}`); 
                this.invoice_information = JSON.parse(invoice_information); 
            }, 

            LeaseagrmIdSelectChanged(leaseagrm_id)
            {
                new Promise 
                (
                    (resolve, reject)=>
                    {
                        this.invoice.leaseagrm_id = undefined; 
                        this.InvoiceInformation(leaseagrm_id); 
                        Object.keys(this.invoice_details).forEach(key=>this.invoice_details[key]=[]);
                        Object.keys(this.list).forEach(key=>this.list[key]=[]); 
                        resolve(leaseagrm_id);  
                    }
                ).then 
                (
                    leaseagrm_id=>
                    {
                        this.invoice.leaseagrm_id = leaseagrm_id; 
                        this.invoice.name = `${this.invoice.leaseagrm_id}-${this.DateReformatDisplay()}`; 
                    }
                ); 
            }, 

            Submit()
            {
                let invoices = 
                {
                    invoice: this.invoice, 
                    details: this.invoice_details
                }
                this.$emit("invoice-submit", invoices); 
            }
        },

        template: 
        `
            <div class="container-fluid">
                <h1><slot name="title">Add New Invoice</slot></h1>
                <br>
                <div class="row">
                    <select-input v-bind="user_input.leaseagrm_id" @input="LeaseagrmIdSelectChanged" :lock="edit_data"></select-input>
                </div>
                <br>
                <div class="row">
                    <text-input name="name" v-model="invoice.name" title="Invoice Name"></text-input>
                </div>

                <slot name="invoice_information" :invoice="invoice" :invoice_information="invoice_information"></slot>
                <hr>
                <template v-if="edit_data||InvoiceDetails">
                    <h2>Invoice Details</h2>
                    <br>
                    <div class="row">
                        <multi-select-input 
                            v-bind="BindObjectMultiSelect('leaseagrm')" 
                            v-model="list.leaseagrm"
                            @search-data-changed="InputMultiSelect('leaseagrm')"
                        ></multi-select-input>
                        <multi-select-input 
                            v-bind="BindObjectMultiSelect('utilities')" 
                            v-model="list.utilities"
                            @search-data-changed="InputMultiSelect('utilities')"
                            ></multi-select-input>
                    </div>

                    <br>

                    <invoice-leaseagrm 
                        v-if="list.leaseagrm.length>0" 
                        v-model="invoice_details.leaseagrm" 
                        v-bind="BindObjectComponent('leaseagrm')"
                    ></invoice-leaseagrm>

                    <br>

                    <invoice-utilities 
                        v-if="list.utilities.length>0" 
                        v-model="invoice_details.utilities" 
                        v-bind="BindObjectComponent('utilities')"
                    ></invoice-utilities>
                </template>

                <div class="row text-right" v-if="ValidInvoiceDetails && InvoiceDetails">
                    <div class="col">
                        <button class="btn" :title="edit_data?'Edit Invoice': 'Add New Invoice'" @click="Submit"><i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i></button>
                    </div>
                </div>
            </div>
        `
    }
); 