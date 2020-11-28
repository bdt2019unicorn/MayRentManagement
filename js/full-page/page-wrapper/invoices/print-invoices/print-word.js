Vue.component
(
    "print-word",
    {
        props: ["invoices", "html"],
        mixins: [print_invoices_mixin],
        data()
        {
            return {
                styles: ""
            }
        },
        created()
        {
            let url = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css";
            this.styles = this.AjaxRequest(url);
        },
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
                                        <style>
                                            ${this.styles}
                                        </style>
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
                                    folder.file(`${invoice.invoice.name}.html`, html)
                                    resolve(index+1);
                                }
                            );
                        }
                    ).then(PromiseChain);
                }

                PromiseChain(0).catch(this.ExportZipFile);
            },

            TestPrint()
            {
                var url = "server/invoice_controller/print-invoices/invoices/invoices/Resolve _AP1_ period 15 Jan 2019 - 31 Oct 2020.html";
                var html = this.AjaxRequest(url);
                console.log(html);
                var data = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(html)}`;
                let a = document.createElement("a");
                a.href = data;
                a.download = "test-document.doc";
                a.click();
            }

        },
        template:
        `
            <vs-button color="light" type="gradient" icon="assignment" title="Print Word" @click="TestPrint">
                <slot></slot>
            </vs-button>
        `
    }
);
