class ProblemLeaseagrms extends React.Component
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            leaseagrm_edit: undefined, 
            leaseagrm_table: "No tenants and unit" 
        }
    }
    Methods = 
    {
        LeaseagrmCategorized()
        {
            let partition_all_null = _.partition(this.props.leaseagrm, leaseagrm=>(leaseagrm["Unit"]==undefined && leaseagrm["Tenant Name"]==undefined)); 
            let unit_tenant_partition = _.partition(partition_all_null[1], leaseagrm=>leaseagrm["Unit"]==undefined); 
            return {
                "No tenants and unit": partition_all_null[0], 
                "No unit": unit_tenant_partition[0], 
                "No head tenant": unit_tenant_partition[1]
            }; 
        }, 
    }
    render()
    {
        var leaseagrm_options = this.LeaseagrmCategorized(); 
        return (
            <React.Fragment>
                <MaterialUI.NativeSelect
                    className="width-full m-3"
                    value={this.state.leaseagrm_table}
                    onChange={event=>this.setState({leaseagrm_table: event.target.value})}
                >
                    {
                        Object.keys(leaseagrm_options).map 
                        (
                            leaseagrm=><option key={leaseagrm} value={leaseagrm}>{leaseagrm}</option>
                        )
                    }
                </MaterialUI.NativeSelect>
                <MaterialUI.Button
                    variant="contained"
                    color="inherit"
                    size="large"
                    startIcon={<MaterialUI.Icon>grid_on</MaterialUI.Icon>}
                    classes={{colorInherit: "btn btn-primary"}}
                >Xuất Excel</MaterialUI.Button>
                <h3>{this.state.leaseagrm_table}</h3>
                <pre>{JSON.stringify(leaseagrm_options[this.state.leaseagrm_table], null, 2)}</pre>
            </React.Fragment>
        ); 
    }
}