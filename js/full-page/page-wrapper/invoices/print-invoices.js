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
                            text: "INVOICE", 
                            style: "header"
                        }, 
                        {
                            columns: 
                            [
                                [
                                    "test", 
                                    "test left " 
                                ], 
                                [
                                    {
                                        stack: 
                                        [
                                            "test ", 
                                            "test right" 
                                        ], 
                                        alignment: "right"
                                    }

                                ]
                            ]
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