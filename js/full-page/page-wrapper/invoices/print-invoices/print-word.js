Vue.component
(
    "print-word",
    {
        props: ["invoices", "html"],
        mixins: [print_invoices_mixin],
        methods:
        {
            PrintWord()
            {
                if(!this.invoices.length)
                {
                    alert("No invoices are selected, please select invoice to print");
                    return;
                }
                var zip = new JSZip();
                var folder = zip.folder("invoices");

                var PromiseChain = (index)=>
                {
                    return new Promise
                    (
                        (resolve, reject)=>
                        {
                            let invoice = this.invoices[index];
                            if(index==this.invoices.length)
                            {
                                reject(zip);
                            }
                            var html =
                            `
                                <html xmlns:o='urn:schemas-microsoft-com:office:office xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                                    <head>
                                        <meta charset='utf-8'>
                                    </head>
                                    <body>
                                        ${this.InvoiceHtml(invoice, this.html)}
                                    </body>
                                </html>
                            `;
                            let url = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(html)}`;
                            fetch(url).then(response=>response.blob()).then
                            (
                                word=>
                                {
                                    folder.file(`${invoice.invoice.name}.doc`, word);
                                    resolve(index+1);
                                }
                            );
                        }
                    ).then(PromiseChain);
                }

                PromiseChain(0).catch(this.ExportZipFile);
            } 
        },
        template:
        `
            <vs-button color="light" type="gradient" icon="assignment" title="Print Word" @click="PrintWord">
                <slot></slot>
            </vs-button>
        `
    }
);
