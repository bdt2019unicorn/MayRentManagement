var print_invoices_mixin = 
{
    mixins: [support_mixin], 
    computed: 
    {
        ServerUrl()
        {
            return `server/controller/invoice/print_invoices.php?building_id=${this.$route.params.building_id}&command=`;
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
            UtilityDateFormat = (date)=> moment(date).format("hh:mmA, Do MMM YYYY"); 
            UtilitySpan = (number)=> `<span class="float-right mx-3">${this.NumeralFormat(Number(number))}</span>`; 
            return `
                <table style="width: 100%; margin: 3px;"
                    <tr><td colspan="3" style="text-align: center;"><img src="${image}"></td></tr>
                    <tr><td colspan="3"><h1 style="text-align: center;">RENTAL AND UTILITY CHARGE</h1></td></tr>
                    <tr><td><br></td></tr>
                    <tr><td><b>Date</b></td><td>:</td><td>${this.DateReformatDisplay()}</td></tr>
                    <tr><td><b>Invoice</b></td><td>:</td><td>${invoice.invoice["name"]}</td></tr>
                    <tr><td><b>To</b></td><td>:</td><td>${invoice.invoice["tenant"]}</td></tr>
                    <tr><td></td><td></td><td><b>${invoice.invoice["unit"]}</b></td></tr>
                    <tr><td><b>Company</b></td><td>:</td><td>${invoice.invoice["company"]}</td></tr>
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
                        <th class="text-left">DESCRIPTION</th>
                        <th class="text-right">VND</th>
                    </tr>
                    ${
                        invoice.details.leaseagrm.map
                        (
                            ({amount, name, ...rest})=>`<tr><td class="text-left px-3">${name}</td><td class="text-right px-3">${this.NumeralFormat(amount)}</td></tr>`
                        ).join("\n") 
                    }
                    ${
                        invoice.details.utilities.map 
                        (
                            ({name, previous_date, date, previous_number, number, quantity, price, amount, ...rest})=>
                            `
                                <tr>
                                    <td>
                                        <table class="utilities">
                                            <tr><td colspan="2" class="px-3">${name}</td></tr>
                                            <tr>
                                                <td class="px-3">
                                                    Begining<br>
                                                    Finishing<br>
                                                    Total 
                                                </td>
                                                <td>
                                                    ${UtilityDateFormat(previous_date)} ${UtilitySpan(previous_number)} <br>
                                                    ${UtilityDateFormat(date)} ${UtilitySpan(number)} <br>
                                                    ${this.NumeralFormat(Number(price))} ${UtilitySpan(quantity)}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td class="text-right px-3"><br><br><br>${this.NumeralFormat(amount)}</td>
                                </tr>
                            `
                        ).join("\n") 
                    }

                    <tr>
                        <th class="text-left">Grand Total</th>
                        <th class="text-right">${this.NumeralFormat(invoice.invoice["grand_total"])}</th>
                    </tr>
                </table>
                <br>
                ${footer}
                <br><br>
            `; 
        }
    },
}