var print_invoices_mixin = 
{
    mixins: [support_mixin], 
    computed: 
    {
        ServerUrl()
        {
            return `server/invoice_controller/print_invoices.php?building_id=${this.$route.params.building_id}&command=`;
        }
    }, 
    methods: 
    {
        ExportZipFile(zip)
        {
            try 
            {
                zip.generateAsync({type: "blob"}).then(content=> saveAs(content, "AllInvoices.zip"));  
            }
            catch
            {
                console.log(zip); 
            }
            
        }, 
        InvoiceHtml(invoice, {footer, image})
        {
            return `
                <table style="width: 100%; margin: 3px;"
                    <tr><td colspan="5" style="text-align: center;"><img src="${image}"></td></tr>
                    <tr><td colspan="5"><h1 style="text-align: center;">RENTAL AND UTILITY CHARGE</h1></td></tr>
                    <tr><td><br></td></tr>
                    <tr>
                        <td><b>Date</b></td><td>:</td><td>${this.DateReformatDisplay()}</td>
                        <td>ROE:</td>
                    </tr>
                    <tr><td><b>Invoice</b></td><td>:</td><td>${invoice.invoice["name"]}</td></tr>
                    <tr><td><b>To</b></td><td>:</td><td>${invoice.invoice["tenant"]}</td></tr>
                    <tr><td></td><td></td><td><b>${invoice.invoice["unit"]}</b></td></tr>
                </table>
                <br>
                <style>
                    .description
                    {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .description th, .description td
                    {
                        border: 3px;
                        border-style: solid;
                    }
                    .utilities
                    {
                        width: 100%;
                    }
                    .utilities td
                    {
                        border-style: none;
                    }
                </style>
                <table class="description">
                    <tr>
                        <th style="text-align: left;">DESCRIPTION</th>
                        <th style="text-align: right;">VND</th>
                    </tr>
                    ${
                        invoice.details.leaseagrm.map
                        (
                            ({amount, name, ...rest})=>`<tr><td style="text-align: left;">${name}</td><td style="text-align: right;">${this.NumeralFormat(amount)}</td></tr>`
                        ).join("\n") 
                    }
                    ${
                        invoice.details.utilities.map 
                        (
                            ({name, previous_date, date, previous_number, number, amount, ...rest})=>
                            `
                                <tr>
                                    <td>
                                        <table class="utilities">
                                            <tr><td colspan="2">${name}</td></tr>
                                            <tr>
                                                <td>
                                                    Begining<br>
                                                    Finishing<br>
                                                    Total 
                                                </td>
                                                <td>
                                                    ${previous_date} <br>
                                                    ${date} <br>
                                                    ${this.NumeralFormat((Number(number) - Number(previous_number)))} VND/m3
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="text-align: right;"><br><br><br>${this.NumeralFormat(amount)}</td>
                                </tr>
                            `
                        ).join("\n") 
                    }

                    <tr>
                        <th style="text-align: left;">Grand Total</th>
                        <th style="text-align: right;">${this.NumeralFormat(invoice.invoice["grand_total"])}</th>
                    </tr>
                </table>
                <br>
                ${footer}
                <br><br>
            `; 
        }
    },
}