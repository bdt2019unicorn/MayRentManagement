class PrintWord extends PrintInvoicesComponent 
{
    render()
    {
        var { Button, Icon } = MaterialUI; 
        return (
            <Button
                variant="contained"
                color="inherit"
                startIcon={<Icon>description</Icon>}
                classes=
                {
                    {
                        colorInherit: "btn btn-purple"
                    }
                }
                onClick=
                {
                    ()=>
                    {
                        var { html, invoices } = this.props; 
                        if(!invoices.length)
                        {
                            alert("Không có hóa đơn nào được chọn. Vui lòng chọn hóa đơn"); 
                            return; 
                        }
                        var zip = new JSZip();
                        var folder = zip.folder("invoices");
                
                        var PromiseChain = (index)=> new Promise
                        (
                            (resolve, reject)=>
                            {
                                let invoice = invoices[index];
                                if(index==invoices.length)
                                {
                                    reject(zip);
                                }
                                var html_invoice =
                                `
                                    <html xmlns:o='urn:schemas-microsoft-com:office:office xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                                        <head>
                                            <meta charset='utf-8'>
                                        </head>
                                        <body>
                                            ${this.InvoiceHtml(invoice, html)}
                                        </body>
                                    </html>
                                `;
                                let url = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(html_invoice)}`;
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
                }
            >
                Word
            </Button>
        );
    }
}