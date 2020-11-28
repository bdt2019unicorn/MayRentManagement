var print_invoices_mixin = 
{
    mixins: [support_mixin], 
    methods: 
    {
        ExportZipFile(zip)
        {
            zip.generateAsync({type: "blob"}).then(content=> saveAs(content, "AllInvoices.zip"));  
        }, 
        InvoiceHtml(invoice, {footer, image})
        {
            return `
                <div class="container-fluid mx-3">
                    <div class="row text-center"><div class="col"><img src="${image}"></div></div>
                    <h1 class="text-center">RENTAL AND UTILITY CHARGE</h1>
                    <br>
                    <div class="row">
                        <div class="col-1"><b>Date</b></div>
                        <div class="col-1">:</div>
                        <div class="col-4">${this.DateReformatDisplay()}</div>
                        <div class="col-6">ROE:</div>
                    </div>
                    <div class="row">
                        <div class="col-1"><b>Invoice</b></div>
                        <div class="col-1">:</div>
                        <div class="col">${invoice.invoice["name"]}</div>
                    </div>
                    <div class="row">
                        <div class="col-1"><b>To</b></div>
                        <div class="col-1">:</div>
                        <div class="col">${invoice.invoice["tenant"]}<br><b>${invoice.invoice["unit"]}</b></div>
                    </div>
                </div>
                <br>
                <div class="containter-fluid mx-3">
                    <div class="row text-center">
                        <div class="col text-center">
                            <style>
                                table.w-100 th, td 
                                {
                                    border: 3px; 
                                    border-style: solid;
                                }
                            </style>
                            <table class="w-100">
                                <tr>
                                    <th>DESCRIPTION</th>
                                    <th class="text-right">VND</th>
                                </tr>
                                ${
                                    invoice.details.leaseagrm.map
                                    (
                                        ({amount, name, ...rest})=>
                                        `
                                            <tr>
                                                <td class="text-left"><div class="container-fluid">${name}</div></td>
                                                <td class="text-right">${amount}</td>
                                            </tr>
                                        `
                                    ).join("\n") 
                                }
                                ${
                                    invoice.details.utilities.map 
                                    (
                                        ({name, previous_date, date, previous_number, number, amount, ...rest})=>
                                        `
                                            <tr>
                                                <td>
                                                    <div class="container-fluid">
                                                        <div class="row">
                                                            <div class="col-12">${name}</div>
                                                            <div class="col-2">
                                                                Begining<br>
                                                                Finishing<br>
                                                                Total 
                                                            </div>
                                                            <div class="col-6">
                                                                ${previous_date} <br>
                                                                ${date} <br>
                                                                ${this.NumeralFormat((Number(number) - Number(previous_number)))} VND/m3
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="text-right"><br><br><br>${amount}</td>
                                            </tr>
                                        `
                                    ).join("\n") 
                                }

                                <tr>
                                    <th><h5>Grand Total</h5></th>
                                    <th class="text-right"><h5>${this.NumeralFormat(invoice.invoice["grand_total"])}</h5></th>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <br>
                ${footer}
                <br><br>
            `; 
        }
    },
}