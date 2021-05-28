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

class RestoreData extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {file: undefined}; 
    }
    render()
    {
        return (
            <div>
                <DropzoneAreaBase
                    onAdd={(file_objects) => this.setState({file: file_objects[0]})}
                    onDelete={(file) => this.setState({file: undefined})} 
                    fileObjects={this.state.file?[this.state.file]: undefined}
                    showAlerts={false}
                    filesLimit={1}
                    maxFileSize={15*(10**6)}
                    showFileNames
                    dropzoneText="Đưa tập tin sao lưu để phục hồi"
                />
                {
                    this.state.file && 
                    <ActionButton 
                        title="Sao lưu dữ liệu" 
                        ActionButtonClick=
                        {
                            ()=>
                            {
                                let form_data = new FormData(); 
                                form_data.append("file", this.state.file.file); 
                                let url = "../server/controller/dashboard/restore.php"; 
                                let result = AjaxRequest(url, form_data, "post"); 
                                if(Number(result))
                                {
                                    alert("Dữ liệu đã được phục hồi"); 
                                    this.BuildingData(); 
                                    this.props.RestoreSuccess(); 
                                    this.setState({file: undefined}); 
                                }
                                else
                                {
                                    alert("Dữ liệu phục hồi thất bại. Đã có lỗi hệ thống"); 
                                }
                            }
                        }
                    />
                }
            </div>
        ); 
    }
}
RestoreData = ConnectComponent.Store(RestoreData); 

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