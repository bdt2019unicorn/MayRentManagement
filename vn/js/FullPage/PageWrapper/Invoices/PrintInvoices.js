class PrintInvoices extends PrintInvoicesComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            excel: [], 
            html: {}, 
            invoices: []
        }; 

        let url = `${this.ServerUrl()}General`;
        let data = ServerJson(url); 
        Object.keys(data).forEach(key=>this.state[key] = data[key]); 
        this.state.html.footer = 
        `
            <table style='width: 100%;'>
                ${
                    this.state.excel.map 
                    (
                        row =>
                        `
                            <tr>
                                <td>
                                    ${row[0]}
                                </td>

                                <td>
                                    ${row[row.length-1]}
                                </td>
                            </tr>
                        `
                    ).join("\n")
                }
            </table>
        `; 
    }
    render()
    {
        var checked_invoices = this.state.invoices.filter(({checked})=>checked); 
        var { Accordion, AccordionDetails, AccordionSummary, Checkbox, Grid, Icon, IconButton } = MaterialUI; 
        return (
            <div>
                <h1>In hóa đơn</h1>
                <br />
                {
                    Boolean(this.state.invoices.length) ?  
                    (
                        <React.Fragment>
                            <div className="space-between-element d-flex">
                                <PrintPdf invoices={checked_invoices} html={this.state.html} />
                                <PrintWord invoices={checked_invoices} html={this.state.html} />
                                <PrintExcel invoices={checked_invoices} footer_array={this.state.excel} image={this.state.html.image} />
                            </div>
                            <br />
                            <Grid container>
                                <Grid item xs={1}>
                                    <Checkbox 
                                        checked={checked_invoices.length==this.state.invoices.length}
                                        indeterminate={Boolean(checked_invoices.length) && (checked_invoices.length<this.state.invoices.length)}
                                        onChange=
                                        {
                                            (event)=>
                                            {
                                                var checked = event.target.checked; 
                                                var invoices = _.cloneDeep(this.state.invoices); 
                                                invoices.forEach(invoice=>invoice.checked = (checked_invoices.length && checked_invoices.length<this.state.invoices.length) ? true: checked); 
                                                this.setState({invoices}); 
                                            }
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6} className="d-flex flex-items-center"><h5 className="text-blue">Invoice</h5></Grid>
                                <Grid item xs={3} className="d-flex flex-items-center"><b>Tenant</b></Grid>
                                <Grid item xs={1} className="d-flex flex-items-center"><b>Unit</b></Grid>
                            </Grid>
                            {
                                this.state.invoices.map
                                ( 
                                    (invoice, index) => 
                                    (
                                        <Accordion key={index} className="border border-blue mb-2">
                                            <AccordionSummary className="p-0">
                                                <Grid container>
                                                    <Grid item xs={1}>
                                                        <Checkbox 
                                                            onClick={(event) => event.stopPropagation()}
                                                            onFocus={(event) => event.stopPropagation()}
                                                            checked={Boolean(this.state.invoices[index].checked)}
                                                            onChange=
                                                            {
                                                                (event)=>
                                                                {
                                                                    var checked = event.target.checked; 
                                                                    var invoices = ImmutabilityHelper
                                                                    (
                                                                        this.state.invoices, 
                                                                        {
                                                                            [index]: 
                                                                            {
                                                                                checked: 
                                                                                {
                                                                                    $set: checked
                                                                                }
                                                                            }
                                                                        }
                                                                    ); 
                                                                    this.setState({invoices}); 
                                                                }
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}><h5 className="text-blue">{invoice.invoice.name}</h5></Grid>
                                                    <Grid item xs={3}><b>{invoice.invoice.tenant}</b></Grid>
                                                    <Grid item xs={1}><b>{invoice.invoice.unit}</b></Grid>
                                                    <Grid item xs={1}><IconButton className="p-0"><Icon>expand_more</Icon></IconButton></Grid>
                                                </Grid>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div>
                                                    <div dangerouslySetInnerHTML={{__html: this.InvoiceHtml(invoice, this.state.html)}}></div>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                )
                            }
                        </React.Fragment>
                    ) : 
                    (
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item xs={6} className="border border-yellow text-red text-center">
                                <h3>Hiện tại không có hóa đơn nào</h3>
                                <h3>Vui lòng thử lại</h3>
                            </Grid>
                        </Grid>
                    )
                }
            </div>
        ); 
    }
}