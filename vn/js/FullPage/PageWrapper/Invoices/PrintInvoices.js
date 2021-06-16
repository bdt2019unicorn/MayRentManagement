class PrintInvoices extends PrintInvoicesComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            excel: [], 
            html: {}, 
            invoices: [], 
            selected: false 
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
    CheckedInvoices = () => 
    {
        return this.invoices.filter(({checked, ...rest})=>checked); 
    } 
    SelectAllBind = () => 
    {
        return {
            size: this.CheckedInvoices.length? "sm": "md", 
            button: Boolean(this.CheckedInvoices.length), 
            buttonVariant: "outline-secondary"
        }
    }
    SelectAllInput = (selected) => 
    {
        if(this.CheckedInvoices.length && this.CheckedInvoices.length<this.invoices.length)
        {
            this.selected = true; 
            this.invoices.forEach(invoice=>invoice.checked=true); 
        }
        else 
        {
            this.invoices.forEach(invoice=>invoice.checked = selected); 
        }
    }
    render()
    {
        var checked_invoices = this.state.invoices.filter(({checked})=>checked); 
        var { Grid, Checkbox } = MaterialUI; 
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
                            {/* 
                            <div class="row border border-info my-2" v-for="(invoice, index) in invoices">
                                <div class="row col-12">
                                    <div class="col-1"><b-form-checkbox v-model="invoices[index].checked" size="md" @change="selected = Boolean(CheckedInvoices.length)"></b-form-checkbox></div>
                                    <div class="col-6"><h6 class="text-info">{{invoice.invoice.name}}</h6></div>
                                    <div class="col-3"><b>{{invoice.invoice.tenant}}</b></div>
                                    <div class="col-1"><b>{{invoice.invoice.unit}}</b></div>
                                    <div class="col-1">
                                        <details-button :show_details="invoice.show_details" @click="invoices[index].show_details=!invoices[index].show_details"></details-button>
                                    </div>
                                </div>
                                <div v-if="invoice.show_details" class="row col-12">
                                    <div class="col" v-html="InvoiceHtml(invoice, html)"></div>
                                </div>
                            </div> */}
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