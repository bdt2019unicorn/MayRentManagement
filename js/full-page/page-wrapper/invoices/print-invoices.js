Vue.component
(
    "print-invoices", 
    {
        mixins: [print_invoices_mixin], 
        data() 
        {
            return {
                invoices: [], 
                layout: {display: {}, html: {}}, 
                pdf: {}, 
                selected: false 
            }
        },
        components: {...bootstrap}, 
        computed: 
        {
            CheckedInvoices()
            {
                return this.invoices.filter(({checked, ...rest})=>checked); 
            }, 
            SelectAllBind()
            {
                return {
                    size: this.CheckedInvoices.length? "sm": "md", 
                    button: Boolean(this.CheckedInvoices.length), 
                    buttonVariant: "outline-secondary"
                }
            }
        },
        created() 
        {
            let url = `server/invoice_controller/print_invoices.php?building_id=${this.$route.params.building_id}`;
            let data = this.AjaxRequest(url); 
            data = JSON.parse(data); 
            Object.keys(data).forEach(key=>this[key] = data[key]); 
        },
        methods: 
        {
            SelectAllInput(selected)
            {
                if(this.CheckedInvoices.length && this.CheckedInvoices.length<this.invoices.length)
                {
                    this.selected = true; 
                    this.invoices.forEach(invoice=>invoice.checked=true); 
                }
                else 
                {
                    this.invoices.forEach(invoice=>invoice.checked = selected); 
                }
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>Print All Invoices</h1>
                <br>
                <template v-if="invoices.length">
                    <div class="container-fluid row">
                        <print-pdf :invoices="CheckedInvoices" :pdf="pdf">PDF</print-pdf>
                        <print-word :invoices="CheckedInvoices" :html="layout.html" class="mx-2">Word</print-word>
                    </div>
                    <br>
                    <div class="row">
                        <div class="row col">
                            <div class="col-1">
                                <b-form-checkbox v-bind="SelectAllBind" v-model="selected" @change="SelectAllInput">
                                    <b-icon v-if="CheckedInvoices.length" :icon='(CheckedInvoices.length==invoices.length)?"check": "dash"'></b-icon>
                                </b-form-checkbox>
                            </div>
                            <div class="col-6"><h6 class="text-info">Invoice</h6></div>
                            <div class="col-3"><b>Tenant</b></div>
                            <div class="col-1"><b>Unit</b></div>
                        </div>
                    </div>
                    <div class="row border border-info my-2" v-for="(invoice, index) in invoices">
                        <div class="row col-12">
                            <div class="col-1"><b-form-checkbox v-model="invoices[index].checked" size="md" @change="selected = Boolean(CheckedInvoices.length)"></b-form-checkbox></div>
                            <div class="col-6"><h6 class="text-info">{{invoice.invoice.name}}</h6></div>
                            <div class="col-3"><b>{{invoice.invoice.tenant}}</b></div>
                            <div class="col-1"><b>{{invoice.invoice.unit}}</b></div>
                            <div class="col-1">
                                <details-button :show_details="invoice.show_details" @click="invoices[index].show_details=!invoices[index].show_details"></details-button>
                            </div>
                        </div>
                        <div v-if="invoice.show_details" class="row col-12">
                            <div class="col" v-html="InvoiceHtml(invoice, layout.html)"></div>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="row justify-content-center align-self-center">
                        <div class="col-6 border border-info text-danger text-center">
                            <h3>There are currently no invoices in this building</h3>
                            <h3>Please try again later</h3>
                        </div>
                    </div>
                </template>

            </div>
        `
    }
); 