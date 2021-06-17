class PrintWord extends BaseComponent 
{
    // props: ["invoices", "html"],
    // mixins: [print_invoices_mixin],
    PrintWord = () => 
    {
        if(!this.invoices.length)
        {
            alert("No invoices are selected, please select invoice to print");
            return;
        }
        var zip = new JSZip();
        var folder = zip.folder("invoices");

        var PromiseChain = (index)=> new Promise
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

        PromiseChain(0).catch(this.ExportZipFile);
    } 
    render()
    {
        var { Button, Icon } = MaterialUI; 
        return (
            <Button
                variant="contained"
                color="inherit"
                startIcon={<Icon>grid_on</Icon>}
                classes=
                {
                    {
                        colorInherit: "btn btn-primary"
                    }
                }
                onClick=
                {
                    ()=>
                    {
                        if(!this.props.invoices.length)
                        {
                            alert("Không có hóa đơn nào được chọn. Vui lòng chọn hóa đơn"); 
                            return; 
                        }
                        var data = {}; 
                        Object.keys(this.props).forEach(key=>data[key]=JSON.stringify(this.props[key])); 
                        console.log(data); 
                        console.log(JSON.stringify(data, null, 2)); 
                        console.log(data.image); 
                
                        var blob = BlobRequest(`${this.ServerUrl()}Excel`, data); 
                        if(blob)
                        {
                            saveAs(blob, "AllInvoices.zip"); 
                        }
                    }
                }
            >
                Excel
            </Button>
        );
    }
}