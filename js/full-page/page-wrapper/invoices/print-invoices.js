Vue.component
(
    "print-invoices", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                checked_index: [], 
                invoices: [], 
                layout: {}, 
                pdf: {}
            }
        },
        computed: 
        {
            PrintPdfBind()
            {
                let invoices = this.checked_index.map(index=> this.invoices[index]); 
                return {
                    invoices: invoices, 
                    pdf: this.pdf
                }; 
            }, 
            TableBind()
            {
                return this.invoices.map(({invoice, ...rest})=>invoice); 
            }
        },
        created() 
        {
            let url = `server/invoice_controller/print_invoices.php?building_id=${this.$route.params.building_id}`;
            let data = this.AjaxRequest(url); 
            data = JSON.parse(data); 
            Object.keys(data).forEach(key=>this[key] = data[key]); 


            //get this line out after test
            this.checked_index = this.invoices.map((invoice, index)=>index); 
        },
        methods: 
        {

        },
        template: 
        `
            <div class="container-fluid">
                <h1>Print All Invoices</h1>
                <print-pdf v-bind="PrintPdfBind">Print PDF</print-pdf>
                <vs-table :data="TableBind"></vs-table>
            </div>
        `
    }
); 