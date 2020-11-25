Vue.component
(
    "print-invoices", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                invoices: [], 
                building_information: {}, 
                image: ""
            }
        },
        computed: 
        {

        },
        created() 
        {
            let url = `server/invoice_controller/print_invoices.php?building_id=${this.$route.params.building_id}`;
            let data = this.AjaxRequest(url); 
            data = JSON.parse(data); 
            Object.keys(data).forEach(key=>this[key] = data[key]); 
        },
        methods: 
        {
            DocDefinition(invoice)
            {
                // LeaseagrmInvoice = (leaseagrm)=> 
                // {
                    
                // }; 

                let grand_total = invoice.details.leaseagrm.reduce 
                (
                    (accumulator, current_value)=> accumulator + current_value["amount"], 0 
                ) + invoice.details.utilities.reduce 
                (
                    (accumulator, current_value)=> accumulator + current_value["amount"], 0 
                ); 
                var docDefinition = 
                {
                    pageSize: 'A4',
                    content: 
                    [
                        {
                            image: this.image, 
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
                                    text: this.DateReformatDisplay(), 
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
                                                                    `${(Number(number) - Number(previous_number)).toFixed(3)} VND/m3`
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
                                            text: this.NumeralFormat(grand_total), 
                                            style: "sub_heading", 
                                            alignment: "right"
                                        }
                                    ]
                                ]
                            } 
                        }, 
                        " ", 
                        {
                            columns: 
                            [
                                {
                                    stack: 
                                    [
                                        "Please make transfer payment to: ", 
                                        `Account name: ${this.building_information["account_name"]}`,
                                        // slfdkj
                                        // sdlfksa
                                        // sd;lfsaf
                                        // need work nhere 
                                        "Account number/Số tài khoản: 0210107275570001",
                                        {
                                            text: "Bank/Ngân hàng: Ngan Hang TMCP Sai gon (https://scb.com.vn/)", 
                                            link: "https://scb.com.vn/", 
                                            color: "blue"
                                        },
                                        "Branch/Chi nhánh: TAN DINH"

                                    ], 
                                    width: "70%"
                                }, 
                                {
                                    stack: 
                                    [
                                        "For and on behalf of ", 
                                        {
                                            text: "May Corporation", 
                                            bold: true 
                                        }, 
                                        {
                                            text: " ", 
                                            lineHeight: 3
                                        }, 
                                        "Authorized Signature", 
                                        {
                                            text: `Lý Diệu Minh
                                            Building Supervisor`, 
                                            bold: true 
                                        }, 
                                        {
                                            text: "nguyenvubinh@outlook.com", 
                                            link: "mailto: nguyenvubinh@outlook.com"
                                        }, 
                                        "Phone No. 01694958317", 
                                        {
                                            text: `MAY Apartments
                                            216/3/21 Nguyen Van Huong
                                            Thao Dien Ward, Dist. 2. HCMC.`, 
                                            italics: true 
                                        }
                                    ], 
                                    width: "*"
                                }
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
                        sub_heading: 
                        {
                            fontSize: 16, 
                            bold: true, 
                            margin: [1, 3]
                        }
                    }
                };
            }, 
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
                                                                "10:00AM, 15th Sept 2019", 
                                                                "10:00AM, 15th Oct 2019", 
                                                                "3900 VND/m3"
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
                                                    text: "2,550,600", 
                                                    alignment: "right", 
                                                }
                                            ]
                                        }
                                    ], 
                                    [
                                        {
                                            text: "Grand Total",
                                            style: "sub_heading"
                                        }, 
                                        {
                                            text: "19,276,105", 
                                            style: "sub_heading", 
                                            alignment: "right"
                                        }
                                    ]
                                ]
                            } 
                        }, 
                        " ", 
                        {
                            columns: 
                            [
                                {
                                    stack: 
                                    [
                                        "Please make transfer payment to: ", 
                                        "Account name/Tên tài khoản: HO QUOC HUNG",
                                        "Account number/Số tài khoản: 0210107275570001",
                                        {
                                            text: "Bank/Ngân hàng: Ngan Hang TMCP Sai gon (https://scb.com.vn/)", 
                                            link: "https://scb.com.vn/", 
                                            color: "blue"
                                        },
                                        "Branch/Chi nhánh: TAN DINH"

                                    ], 
                                    width: "70%"
                                }, 
                                {
                                    stack: 
                                    [
                                        "For and on behalf of ", 
                                        {
                                            text: "May Corporation", 
                                            bold: true 
                                        }, 
                                        {
                                            text: " ", 
                                            lineHeight: 3
                                        }, 
                                        "Authorized Signature", 
                                        {
                                            text: `Lý Diệu Minh
                                            Building Supervisor`, 
                                            bold: true 
                                        }, 
                                        {
                                            text: "nguyenvubinh@outlook.com", 
                                            link: "mailto: nguyenvubinh@outlook.com"
                                        }, 
                                        "Phone No. 01694958317", 
                                        {
                                            text: `MAY Apartments
                                            216/3/21 Nguyen Van Huong
                                            Thao Dien Ward, Dist. 2. HCMC.`, 
                                            italics: true 
                                        }
                                    ], 
                                    width: "*"
                                }
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
                        sub_heading: 
                        {
                            fontSize: 16, 
                            bold: true, 
                            margin: [1, 3]
                        }
                    }
                };

                var zip = new JSZip();
                var pdf_folder = zip.folder("pdf");

                const pdf_generator = pdfMake.createPdf(docDefinition); 
                var PromiseChain = function(index)
                {
                    return new Promise 
                    (
                        (resolve, reject)=>
                        {
                            if(index>4)
                            {
                                reject(); 
                            }
                            pdf_generator.getBlob
                            (
                                pdf=> 
                                {
                                    pdf_folder.file(`static-template-${index}.pdf`, pdf); 
                                    resolve(index+1); 
                                }
                            )
                        }
                    ).then(PromiseChain); 
                }

                PromiseChain(0).catch
                (
                    ()=>
                    {
                        zip.generateAsync
                        (
                        {
                            type: "blob"
                        }
                        ).then
                        (
                        content=>
                        {
                            saveAs(content, "allPDF.zip");
                        }
                        );                        
                    }
                ); 
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