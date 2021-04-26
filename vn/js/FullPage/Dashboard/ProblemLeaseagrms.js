class ProblemLeaseagrms extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            leaseagrm_edit: undefined, 
            leaseagrm_table: "Không có người thuê và căn hộ", 
            selected: [], 
            table_actions: this.TableActions("leaseagrm")
        }
    }
    Methods = 
    {
        DeleteSuccess(delete_duplicate=undefined)
        {
            // if(delete_duplicate)
            // {
            //     this.$emit("delete-duplicate"); 
            //     return; 
            // }

            // all_leaseagrm = this.leaseagrm.filter(leaseagrm=>!this.check_array.includes(leaseagrm.ID)); 
            // this.check_array = []; 
            // this.$emit("problem-leaseagrm-deleted", all_leaseagrm); 
        }, 
        LeaseagrmCategorized()
        {
            let translate_url = TranslationValues.TranslateUrl("leaseagrm"); 
            var leaseagrm = TranslationValues.TranslateTable(this.props.leaseagrm, translate_url); 
            let partition_all_null = _.partition(leaseagrm, leaseagrm=>(leaseagrm["Đơn vị"]==undefined && leaseagrm["Người thuê"]==undefined)); 
            let unit_tenant_partition = _.partition(partition_all_null[1], leaseagrm=>leaseagrm["Đơn vị"]==undefined); 
            return {
                "Không có người thuê và căn hộ": partition_all_null[0], 
                "Không có căn hộ": unit_tenant_partition[0], 
                "Không có người thuê": unit_tenant_partition[1]
            }; 
        }, 
    }
    render()
    {
        var leaseagrm_options = this.LeaseagrmCategorized(); 
        return (
            <React.Fragment>
                <MaterialUI.NativeSelect
                    className="width-full m-3 select-center-text"
                    value={this.state.leaseagrm_table}
                    onChange={event=>this.setState({leaseagrm_table: event.target.value, selected: []})}
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
                <ScrollingTable 
                    table={leaseagrm_options[this.state.leaseagrm_table]}
                    table_actions={this.state.table_actions}
                    SelectionModelChanged={(selected)=>this.setState({selected})}
                >
                    <TableActions 
                        selected={this.state.selected} 
                        params=
                        {
                            {
                                controller: "leaseagrm", 
                                action: "GeneralEdit"
                            }
                        }
                        controller="leaseagrm"
                        DeleteSuccess={this.DeleteSuccess}
                    />
                </ScrollingTable>
            </React.Fragment>
        ); 
    }
}