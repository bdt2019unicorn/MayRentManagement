Vue.component
(
    "print-pdf", 
    {
        props: ["invoices", "pdf"], 
        mixins: [print_invoices_mixin], 
        methods: 
        {
            DocDefinition(invoice)
            {
                let specific_content = 
                [
                    {
                        columns: 
                        [
                            {
                                text: "Invoice", 
                                width: "10%"
                            },                                 
                            {
                                text: ":", 
                                width: "5%"
                            },                                 
                            {
                                text: invoice.invoice["name"], 
                                width: "35%"
                            }
                        ]
                    }, 
                    {
                        columns: 
                        [
                            {
                                text: "To", 
                                width: "10%"
                            },                                 
                            {
                                text: ":", 
                                width: "5%"
                            },                                 
                            {
                                text: invoice.invoice["tenant"], 
                                width: "35%"
                            }
                        ]
                    }, 
                    {
                        columns: 
                        [
                            {
                                text: "", 
                                width: "15%"
                            },                                                               
                            {
                                text: `Unit ${invoice.invoice["unit"]}`, 
                                width: "35%", 
                                bold: true 
                            }
                        ], 
                        lineHeight: 2 
                    }, 
                    {
                        layout: 'lightHorizontalLines', 
                        table: 
                        {
                            headerRows: 1,
                            widths: [ '80%', '20%' ],
                            body: 
                            [
                                [
                                    {
                                        text: "DISCRIPTION", 
                                        bold: true 
                                    }, 
                                    {
                                        text: "VND", 
                                        bold: true, 
                                        alignment: "right"
                                    }
                                ], 

                                ...invoice.details.leaseagrm.map 
                                (
                                    ({amount, name, ...rest})=> 
                                    [
                                        name, 
                                        {
                                            text: amount, 
                                            alignment: "right"
                                        }
                                    ]
                                ), 

                                ...invoice.details.utilities.map 
                                (
                                    ({name, previous_date, date, previous_number, number, amount, ...rest})=>
                                    [
                                        {
                                            stack: 
                                            [
                                                name, 
                                                {
                                                    columns: 
                                                    [
                                                        {
                                                            width: "15%", 
                                                            stack: 
                                                            [
                                                                "Begining", 
                                                                "Finishing", 
                                                                "Total"
                                                            ]
                                                        }, 
                                                        {
                                                            width: "50%", 
                                                            stack: 
                                                            [
                                                                this.DateReformatDisplay(previous_date), 
                                                                this.DateReformatDisplay(date), 
                                                                `${this.NumeralFormat((Number(number) - Number(previous_number)))} VND/m3`
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }, 
                                        {
                                            stack: 
                                            [
                                                " ", 
                                                " ", 
                                                " ", 
                                                {
                                                    text: this.NumeralFormat(amount), 
                                                    alignment: "right", 
                                                }
                                            ]
                                        }
                                    ] 
                                ), 
                                [
                                    {
                                        text: "Grand Total",
                                        style: "sub_heading"
                                    }, 
                                    {
                                        text: this.NumeralFormat(invoice.invoice["grand_total"]), 
                                        style: "sub_heading", 
                                        alignment: "right"
                                    }
                                ]
                            ]
                        } 
                    } 
                ]; 

                var doc_definition = R.clone(this.pdf.doc_definition); 
                doc_definition.content = [...doc_definition.content, ...specific_content, this.pdf.content_footer]; 
                return doc_definition; 
            }, 

            PrintPdf()
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
                            let doc_definition = this.DocDefinition(invoice); 
                            pdfMake.createPdf(doc_definition).getBlob
                            (
                                pdf=> 
                                {
                                    folder.file(`${invoice.invoice.name}.pdf`, pdf); 
                                    resolve(index+1); 
                                }
                            )
                        }
                    ).then(PromiseChain); 
                }

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