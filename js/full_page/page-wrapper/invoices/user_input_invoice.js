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
                    name: undefined, 
                    note: undefined 
                }, 
                invoice_details: 
                {
                    leaseagrm: [], 
                    utilities: []
                }, 
                invoice_information: 
                {
                    unit_name: undefined, 
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
                let invoice_complete = Object.keys(this.invoice).filter(key=>key!="note").map(key=>Boolean(this.invoice[key])); 
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
        created() 
        {
            if(this.edit_data)
            {
                this.invoice = R.clone(this.edit_data.invoice); 
                this.InvoiceInformation(this.edit_data.invoice.leaseagrm_id); 
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
                        if(!this.edit_data)
                        {
                            this.invoice.name = `${this.invoice.leaseagrm_id}-${this.DateReformatDisplay()}`; 
                            this.invoice.note = undefined; 
                        }
                    }
                ); 
            }, 

            MultiSelectInput(property)
            {
                if(this.list[property].length==0)
                {
                    this.invoice_details[property] = []; 
                }
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
                <h1><slot name="title"></slot></h1>
                <br>
                <div class="row">
                    <select-input 
                        v-bind="user_input.leaseagrm_id" 
                        @input="LeaseagrmIdSelectChanged" 
                        :lock="edit_data"
                        :edit_data="edit_data?edit_data.invoice:undefined"
                    ></select-input>
                </div>
                <br>
                <div class="row">
                    <text-input name="name" v-model="invoice.name" title="Invoice Name"></text-input>
                </div>

                <div class="row">
                    <text-input name="note" v-model="invoice.note" title="Note"></text-input>
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
                            @search-data-changed="MultiSelectInput('leaseagrm')"
                        ></multi-select-input>
                        <multi-select-input 
                            v-bind="BindObjectMultiSelect('utilities')" 
                            v-model="list.utilities"
                            @search-data-changed="MultiSelectInput('utilities')"
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
                        <submit-button :title="edit_data?'Edit Invoice': 'Add New Invoice'" @submit-button-clicked="Submit"></submit-button>
                    </div>
                </div>
            </div>
        `
    }
); 