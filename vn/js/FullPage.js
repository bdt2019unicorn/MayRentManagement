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

class AboutId extends React.Component
{
    constructor(props)
    {
        super(props); 
    }
    render()
    {
        return (
            <div>
                <h3>{JSON.stringify(this.props)}</h3>
                <h3 style={{color: "red"}}>{this.props.match.params.id}</h3>
                <button type="button" onClick={()=>this.props.history.push("/about")}>About</button>
                <button type="button" onClick={()=>this.props.history.push("/")}>Home</button>
            </div>
        )
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
            // buildings: JSON.parse(buildings) 
        }; 
    }

    render()
    {
        // let buildings = this.state.buildings.map(building=><p key={building.id}>{JSON.stringify(building)}</p>); 
        let Switch = ReactRouterDOM.Switch; 
        let Link = ReactRouterDOM.Link; 
        let Route = ReactRouterDOM.Route; 
        return (
            <ReactRouterDOM.HashRouter>
                {/* <ImportExcel /> */}
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </div>
                {/* {buildings} */}
                <Switch>
                    <Route component={Home} exact path="/" />
                    <Route component={PageAdministration} path="/page-administration/:controller" />
                    <Route component={About} exact path="/about" />
                    <Route component={AboutId} path="/about/:id" />
                </Switch>
                <Parent />
            </ReactRouterDOM.HashRouter>
        ); 
    }
}