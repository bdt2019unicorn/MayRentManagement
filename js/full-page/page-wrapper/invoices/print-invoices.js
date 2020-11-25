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
                layout: {display: {}, html: {}}, 
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
                return {
                    data: this.invoices.map(({invoice, ...rest})=>invoice), 
                    multiple: true
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
            <div class="container-fluid">
                <h1>Print All Invoices</h1>
                <print-pdf v-bind="PrintPdfBind">Print PDF</print-pdf>
                <vs-table v-bind="TableBind">
                    <template slot="thead">
                        <vs-th v-for="label in Object.values(layout.display)">{{label}}</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr v-for="invoice in data" :data="invoice">
                            <vs-td v-for="key in Object.keys(layout.display)" :data="invoice[key]">{{invoice[key]}}</vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        `
    }
); 