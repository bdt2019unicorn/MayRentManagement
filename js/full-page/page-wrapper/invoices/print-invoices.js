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
                            ]
                        }, 
                        {
                            layout: 'lightHorizontalLines', // optional
                            table: 
                            {
                                headerRows: 1,
                                widths: [ '*', 'auto', 100, '*' ],
                                body: 
                                [
                                    [ 'First', 'Second', 'Third', 'The last one' ],
                                    [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                                    [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
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
            } 
        },
        watch: 
        {
        },
        template: 
        `
            <div>
                <button @click="PrintTest">test</button>
            </div>
        `
    }
); 