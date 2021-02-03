class Home extends React.Component 
{
    constructor(props)
    {
        super(props); 
    }
    render()
    {
        return (
            <div>
                <h1>Home</h1>
            </div>
        ); 
    }
}

class About extends React.Component 
{
    constructor(props)
    {
        super(props); 
    }
    render()
    {
        return (
            <div>
                <h1>About</h1>
            </div>
        ); 
    }
}

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
            <window.ReactRouterDOM.BrowserRouter>
                <ImportExcel />
                {buildings}
            </window.ReactRouterDOM.BrowserRouter>
        ); 
    }
}