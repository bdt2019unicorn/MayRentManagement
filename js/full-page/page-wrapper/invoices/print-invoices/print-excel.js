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

                $.ajax 
                (
                    {
                        url: `${this.ServerUrl}Excel`, 
                        type: "POST", 
                        data: data,  
                        async: false, 
                        dataType: 'text',                              
                        mimeType: 'text/plain; charset=x-user-defined',
                        success: (data)=>
                        {
                            var bytes = new Uint8Array(data.length);
                            for (var i = 0; i < data.length; i++) 
                            {
                                bytes[i] = data.charCodeAt(i);
                            }
                            var blob = new Blob([bytes], {type: "application/zip"}); 
                            saveAs(blob, "AllInvoices.zip"); 
                        }, 
                        error: function(error)
                        {
                            alert("There is something wrong with the server! Please try again"); 
                            console.log(error); 
                        }
                    }
                ); 
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