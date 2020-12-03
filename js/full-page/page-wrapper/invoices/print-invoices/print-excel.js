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

                var form_data = new FormData(); 
                Object.keys(this.$props).forEach(key=>form_data.append(key, JSON.stringify(this.$props[key]))); 
                let url = `${this.ServerUrl}Excel`;
                let result = this.AjaxRequest(url, form_data, "post"); 
                console.log(result); 
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
