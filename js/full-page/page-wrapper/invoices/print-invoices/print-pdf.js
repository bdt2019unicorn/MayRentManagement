Vue.component
(
    "print-pdf", 
    {
        props: ["html", "invoices"], 
        mixins: [print_invoices_mixin], 
        methods: 
        {
            PrintPdf()
            {
                if(!this.invoices.length)
                {
                    alert("No invoices are selected, please select invoice to print"); 
                    return; 
                }
                var zip = new JSZip();
                var folder = zip.folder("invoices");
                var options = 
                {
                    margin: 10, 
                    html2canvas: {scale: 5}
                }; 

                var PromiseChain = (index)=> new Promise 
                (
                    (resolve, reject)=>
                    {
                        let invoice = this.invoices[index]; 
                        if(index==this.invoices.length)
                        {
                            reject(zip); 
                        }
                        let html = this.InvoiceHtml(invoice, this.html); 
                        html2pdf().set(options).from(html).outputPdf("blob").then
                        (
                            pdf=>
                            {
                                folder.file(`${invoice.invoice.name}.pdf`, pdf); 
                                resolve(index+1); 
                            }
                        ); 
                    }
                ).then(PromiseChain); 

                PromiseChain(0).catch(this.ExportZipFile); 
            
            } 
        },
        template: 
        `
            <vs-button color="danger" type="gradient" icon="picture_as_pdf" title="Print PDF" @click="PrintPdf">
                <slot></slot>
            </vs-button>
        `
    }
); 