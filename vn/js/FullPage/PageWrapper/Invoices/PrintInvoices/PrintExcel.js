class PrintExcel extends PrintInvoicesComponent 
{
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