Vue.component
(
    "print-invoices", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                invoices: [], 
                layout: {display: {}, html: {}}, 
                pdf: {}, 
                selected: [],
                select: false 
            }
        },
        computed: 
        {
            CheckedInvoices()
            {
                return this.invoices.filter(({selected, ...rest})=>selected); 
            }, 
            PrintPdfBind()
            {
                return {
                    invoices: this.CheckedInvoices, 
                    pdf: this.pdf
                }; 
            }, 
            SelectAllBind()
            {
                return {
                    size: "large", 
                    icon: (this.CheckedInvoices.length==this.invoices.length)?"check": "remove"
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
            CheckSelectAll
        },
        template: 
        `
            <div class="container-fluid">
                <h1>Print All Invoices</h1>
                <div class="container-fluid row">
                    <print-pdf v-bind="PrintPdfBind">Print PDF</print-pdf>
                </div>
                <div class="row">
                    <div class="row col">
                        <div class="col-1"><vs-checkbox v-bind="SelectAllBind" v-model="select"></vs-checkbox></div>
                        <div class="col-6"><h6 class="text-info">Invoice</h6></div>
                        <div class="col-3"><b>Tenant</b></div>
                        <div class="col-1"><b>Unit</b></div>
                    </div>
                </div>
                <div class="row border border-info my-2" v-for="(invoice, index) in invoices">
                    <div class="row col">
                        <div class="col-1"><vs-checkbox v-model="invoices[index].checked" size="large" @input="CheckSelectAll"></vs-checkbox></div>
                        <div class="col-6"><h6 class="text-info">{{invoice.invoice.name}}</h6></div>
                        <div class="col-3"><b>{{invoice.invoice.tenant}}</b></div>
                        <div class="col-1"><b>{{invoice.invoice.unit}}</b></div>
                        <div class="col-1">
                            <details-button :show_details="invoice.show_details" @click="invoices[index].show_details=!invoices[index].show_details"></details-button>
                        </div>
                    </div>
                    <div v-if="invoice.show_details" class="row">
                        <pre>
                            {{invoice}}
                        </pre>
                    </div>
                </div>

            </div>
        `
    }
); 


// create a check box group for whole bunch of collapsing thing - maybe the old trick like how we do before
// icon = remove -- for the partial select 
// icon = check if we check them all. 