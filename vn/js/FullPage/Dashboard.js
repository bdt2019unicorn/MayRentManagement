class Dashboard extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            current_tab: "ProblemLeaseagrms", 
            data: 
            {
                leaseagrm: [], 
                revenue_expense: 
                {
                    revenue: [], 
                    expense: []
                }
            }
        }; 
        this.state.data = this.GenerateData(); 
    }
    BackupRestoreData = () => <BackupRestoreData RestoreSuccess={this.GenerateData} />
    GenerateData = () => 
    {
        let data = AjaxRequest("../server/controller/dashboard/general.php"); 
        return JSON.parse(data); 
    } 
    ProblemLeaseagrms = (props) => 
    (
        <ProblemLeaseagrms 
            {...props}
            leaseagrm={this.state.data.leaseagrm}
            DeleteSuccess={()=>this.setState({data: this.GenerateData()})}
        />
    ) 
    render()
    {
        var Tab = MaterialUI.Tab; 
        var CurrentComponent = this[this.state.current_tab]? this[this.state.current_tab]: window[this.state.current_tab]; 
        return (
            <AuthorizedComponent>
                <div className="m-3">
                    <MaterialUI.AppBar position="static" >
                        <MaterialUI.Tabs 
                            value={this.state.current_tab} 
                            onChange={(event, new_value)=>this.setState({current_tab: new_value})}
                            variant="fullWidth"
                        >
                            <Tab label="Hợp đồng có vấn đề" value="ProblemLeaseagrms" />
                            <Tab label="Các tòa nhà" value="Buildings" />
                            <Tab label="Các đơn vị tính toán" value="BasicCalculationsUnits" />
                            { this.props.user_permissions.AddEdit && <Tab label="Sao lưu/Khôi phục dữ liệu" value="BackupRestoreData" /> }
                        </MaterialUI.Tabs>
                    </MaterialUI.AppBar>
                    <div className="m-3">
                        <CurrentComponent user_permissions={this.props.user_permissions} />
                    </div>
                </div>
            </AuthorizedComponent>
        ); 
    }
}
Dashboard = ConnectComponent.Store(Dashboard); 