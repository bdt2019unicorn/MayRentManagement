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
                doc_definition: {}
            }
        },
        computed: 
        {
            PrintPdfBind()
            {
                let invoices = this.checked_index.map(index=> this.invoices[index]); 
                return {
                    invoices: invoices, 
                    doc_definition: this.doc_definition
                }; 
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
            <div>
                <print-pdf v-bind="PrintPdfBind">Print PDF</print-pdf>
            </div>
        `
    }
); 