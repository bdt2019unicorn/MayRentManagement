class Buildings extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            add_building_form: undefined, 
            import_buildings: undefined
        }; 
    }
    AddBuilding = (data) =>
    {
        let url = "../server/controller/database/import.php?import_controller=buildings"; 
        let result = SubmitData("excel", url, [data]); 
        if(Number(result))
        {
            this.BuildingData(); 
            alert("Thêm tòa nhà thành công"); 
            this.setState({add_building_form: undefined}); 
        }
        else
        {
            alert("Thêm tòa nhà thất bại. Đã có lỗi hệ thống"); 
        }
    } 
    DeleteBuilding = (building_id) =>
    {
        var url = `../server/controller/database/delete.php?table=buildings`; 
        var result = SubmitData("delete", url, [building_id]); 
        if(result)
        {
            this.BuildingData(); 
            alert("Xóa tòa nhà thành công"); 
        }
        else 
        {
            alert("Xóa tòa nhà thất bại. Đã có lỗi hệ thống"); 
        }
    }
    render()
    {
        var Grid = MaterialUI.Grid; 
        var Button = MaterialUI.Button; 
        var IconButton = MaterialUI.IconButton; 
        var Icon = MaterialUI.Icon; 
        var display = _.get(this.props.building_user_input, "display") || {}; 
        var add_building = 
        (
            <div>
                <CloseButton onClick={()=>this.setState({add_building_form: undefined})} />
                <UserInput title="Thêm tòa nhà" form={this.state.add_building_form} FormSubmitValid={this.AddBuilding} />
            </div>
        ); 
        var import_buildings = 
        (
            <div>
                <CloseButton onClick={()=>this.setState({import_buildings: undefined})} />
                <ImportExcel controller="buildings" ImportExcelSuccess={this.BuildingData}/>
            </div>
        ); 
        var buildings_list = 
        (
            <Grid container spacing={1}>
                {
                    this.props.buildings_data.map
                    (
                        building=>
                        (
                            <Grid key={encodeURIComponent(JSON.stringify(building))} item xs={4}>
                                <MaterialUI.Card>
                                    <MaterialUI.CardHeader title={<h6 className="text-center">{building.name}</h6>} />
                                    <MaterialUI.CardContent>
                                        {
                                            Object.keys(display).map
                                            (
                                                (key, index)=>
                                                (
                                                    <React.Fragment key={index}>
                                                        <b>{display[key]}: </b> 
                                                        <span>{building[key]}</span>
                                                        <br />
                                                    </React.Fragment>
                                                )
                                            )
                                        }
                                    </MaterialUI.CardContent>
                                    <MaterialUI.CardActions className="flex-justify-end">
                                        {
                                            this.props.user_permissions.DataEntry && 
                                            <IconButton style={{color: "red"}} onClick={()=>this.DeleteBuilding(building.id)}>
                                                <Icon>delete</Icon>
                                            </IconButton>
                                        }
                                        <ReactRouterDOM.Link to={`GeneralEdit/buildings?id=${building.id}`}>
                                            <IconButton style={{color: "purple"}}>
                                                <Icon>edit</Icon>
                                            </IconButton>
                                        </ReactRouterDOM.Link>
                                    </MaterialUI.CardActions>
                                </MaterialUI.Card>
                            </Grid>
                        )
                    )
                }
            </Grid>
        ); 

        var buildings_display = buildings_list; 
        if(this.state.add_building_form)
        {
            buildings_display = add_building; 
        }
        else if(this.state.import_buildings) 
        {
            buildings_display = import_buildings; 
        }
        return (
            <div>
                {
                    this.props.user_permissions.DataEntry && 
                    <div className="space-between-element">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<MaterialUI.Icon>add_circle</MaterialUI.Icon>}
                            onClick={()=>this.setState({add_building_form: this.props.building_user_input})}
                        >Thêm</Button>
                        {
                            this.props.user_permissions.Reviewer && 
                            <Button
                                variant="contained"
                                color="inherit"
                                size="large"
                                startIcon={<MaterialUI.Icon>grid_on</MaterialUI.Icon>}
                                classes={{colorInherit: "btn btn-primary"}}
                                onClick={()=>this.setState({import_buildings: true})}
                            >Nhập với Excel</Button>
                        }
                    </div>
                }
                <br />
                {buildings_display}
            </div>
        ); 
    }
}
Buildings = ConnectComponent.Store(Buildings); 