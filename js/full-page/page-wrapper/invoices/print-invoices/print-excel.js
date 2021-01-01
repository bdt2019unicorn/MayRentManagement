Vue.component
(
    "print-excel",
    {
        props: ["footer_array", "image", "invoices"],
        mixins: [print_invoices_mixin],
        methods:
        {
            PrintExcel()
            {
                if(!this.invoices.length)
                {
                    alert("No invoices are selected, please select invoice to print");
                    return;
                }
                var data = {}; 
                Object.keys(this.$props).forEach(key=>data[key]=JSON.stringify(this.$props[key])); 

                var blob = this.BlobRequest(`${this.ServerUrl}Excel`, data); 
                if(blob)
                {
                    saveAs(blob, "AllInvoices.zip"); 
                }
            } 
        },
        template:
        `
            <vs-button color="success" type="gradient" icon="table_view" title="Print Excel" @click="PrintExcel">
                <slot></slot>
            </vs-button>
        `
    }
);