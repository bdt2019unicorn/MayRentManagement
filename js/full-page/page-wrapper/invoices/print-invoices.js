Vue.component
(
    "print-invoices", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                monthly_invoices: {}, 
                monthly_invoices_display: {}, 
                title: "Add Monthly Invoices", 
                user_input: {}
            }
        },
        computed: 
        {

        },
        created() 
        {
        },
        methods: 
        {
            async LogoImg()
            {
                var url_img = "img/logo.jpeg"; 
                var response = await fetch(url_img); 
                var blob = await response.blob(); 

                function ReadBlob(blob)
                {
                    return new Promise 
                    (
                        (resolve, reject)=>
                        {
                            var file_reader = new FileReader(); 
                            file_reader.onloadend = function()
                            {
                                resolve(file_reader.result); 
                            }
                            file_reader.readAsDataURL(blob); 
                        }
                    ); 
                }

                return await ReadBlob(blob); 
            }, 
            async PrintTest()
            {
                let image = await this.LogoImg(); 
                console.log(image); 
                var docDefinition = 
                {
                    pageSize: 'A4',
                    content: 
                    [
                        {
                            image: image, 
                            width: 100, 
                            alignment: "center"
                        }, 
                        {
                            text: "RENTAL AND UTILITY CHARGE", 
                            style: "header", 
                            alignment: "center"
                        }, 
                        {
                            columns: 
                            [
                                {
                                    text: "Date", 
                                    width: "10%"
                                },                                 
                                {
                                    text: ":", 
                                    width: "5%"
                                },                                 
                                {
                                    text: "15-Oct-19", 
                                    width: "35%"
                                }, 
                                {
                                    text: "", 
                                    width: "10%"
                                }, 
                                {
                                    text: "ROE:", 
                                    width: "10%"
                                }, 
                                {
                                    text: "", 
                                    width: "*"
                                }
                            ]
                        }, 
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
                                    text: "TE402-11 / 2019", 
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
                                    text: "Mr. Clark William Michael", 
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
                                    text: "Apartment 402", 
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
                                            alignment: "center"
                                        }
                                    ], 
                                    [
                                        "1. Rental payment from 15th Oct 2019 - 15th Nov 2019", 
                                        {
                                            text: "16,278,500", 
                                            alignment: "right"
                                        }
                                    ], 
                                    [
                                        {
                                            stack: 
                                            [
                                                "2.Electricity Amount using from 15th Sept 2019 to 15th Oct 2019", 
                                                {
                                                    columns: 
                                                    [
                                                        {
                                                            text: "test", 
                                                            width: "50%"
                                                        }, 
                                                        {
                                                            text: "test", 
                                                            width: "50%", 
                                                            alignment: "right"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }, ""
                                    ]
                                ]
                            } 
                        }
                    ], 
                    styles: 
                    {
                        header: 
                        {
                            fontSize: 22,
                            bold: true, 
                            margin: [1, 5]
                        },
                    }
                };

                pdfMake.createPdf(docDefinition).open(); 
            }, 
            async TestWithConversion()
            {
                var url = "server/invoice_controller/print-invoices/test copy.html"; 
                var styles = this.AjaxRequest("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"); 
                var html = this.AjaxRequest(url); 
                html = 
                `
                    <style>
                        ${styles}
                    </style>

                    ${html}
                `; 
                var content = htmlToPdfmake(html); 
                var doc_definition = {content: content}; 
                pdfMake.createPdf(doc_definition).open(); 
                console.log(content); 
                // var new_win = window.open("", "_blank"); 
                
                // new_win.open(); 
                // new_win.document.write(html); 
                // console.log(content); 
            }
        },
        watch: 
        {
        },
        template: 
        `
            <div>
                <button @click="TestWithConversion">test</button>
            </div>
        `
    }
); 