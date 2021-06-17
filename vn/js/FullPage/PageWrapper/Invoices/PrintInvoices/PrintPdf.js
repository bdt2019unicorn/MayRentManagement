class PrintPdf extends PrintInvoicesComponent 
{
    render()
    {
        var { Button, Icon } = MaterialUI; 
        return (
            <Button
                variant="contained"
                color="secondary"
                startIcon={<Icon>picture_as_pdf</Icon>}
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
                        var options = 
                        {
                            margin: 10, 
                            html2canvas: {scale: 5}
                        }; 

                        var PromiseChain = (index)=> new Promise 
                        (
                            (resolve, reject)=>
                            {
                                let invoice = invoices[index]; 
                                if(index==invoices.length)
                                {
                                    reject(zip); 
                                }
                                let html_pdf = this.InvoiceHtml(invoice, html); 
                                html2pdf().set(options).from(html_pdf).outputPdf("blob").then
                                (
                                    pdf=>
                                    {
                                        folder.file(`${invoice.invoice.name}.pdf`, pdf); 
                                        resolve(index+1); 
                                    }
                                ); 
                            }
                        ).then(PromiseChain); 

                        PromiseChain(0).catch(this.ExportZipFile); 
                    }
                }
            >
                PDF
            </Button>
        ); 
    }

}