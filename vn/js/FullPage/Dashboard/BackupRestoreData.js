class BackupData extends React.Component
{
    render()
    {
        return (
            <a href="../server/controller/dashboard/backup.php" className="icon-same-line-word">
                <MaterialUI.Icon>cloud_download</MaterialUI.Icon> Tải tập tin sao lưu
            </a>
        ); 
    }
}

class RestoreData extends React.Component
{
    render()
    {
        return (
            <a className="file-upload-download-label">
                
            </a>
        ); 
    }
}

class BackupRestoreData extends React.Component 
{
    constructor(props)
    {
        super(props); 
        this.state = {current_tab: "BackupData"}; 
    }
    render()
    {
        var Grid = MaterialUI.Grid; 
        var Tab = MaterialUI.Tab; 
        var CurrentComponent = window[this.state.current_tab]; 
        var all_tabs = 
        [
            {label: "Sao lưu dữ liệu", value: "BackupData"}, 
            {label: "Phục hồi dữ liệu", value: "RestoreData"}
        ].map 
        (
            ({label, value})=>
            <Tab 
                key={value} 
                label={label} 
                value={value} 
                classes={{selected: "btn btn-primary"}}
            /> 
        ); 
        return (
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <MaterialUI.Tabs 
                        value={this.state.current_tab} 
                        onChange={(event, new_value)=>this.setState({current_tab: new_value})}
                        orientation="vertical"
                        indicatorColor="primary"
                        variant="fullWidth"
                    >
                        {all_tabs}
                    </MaterialUI.Tabs>
                </Grid>
                <Grid item xs={8}>
                    <CurrentComponent RestoreSuccess={this.props.RestoreSuccess} />
                </Grid>
            </Grid>
        ); 
    }
}