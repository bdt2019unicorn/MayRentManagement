class FullPage extends React.Component 
{
    constructor(props)
    {
        super(props); 
        var url = "../server/overview_controller/overview_controller.php?overview_controller=buildings"; 
        let buildings = AjaxRequest(url); 
        this.state = 
        {
            buildings: JSON.parse(buildings) 
        }; 
    }

    render()
    {
        let buildings = this.state.buildings.map(building=><p key={building.id}>{JSON.stringify(building)}</p>); 
        return (
            <React.Fragment>
                <ImportExcel />
                {buildings}
            </React.Fragment>
        ); 
    }
}