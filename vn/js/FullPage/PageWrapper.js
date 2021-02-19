class Sidebar extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {expanded: undefined}; 
    }
    render() 
    {
        var Link = ReactRouterDOM.Link; 
        var sidebar = this.props.sidebar.map 
        (
            controller => 
            {
                var AccordionChange = (event, is_expanded) =>
                {
                    if(is_expanded)
                    {
                        this.setState({expanded: controller.name}); 
                    }
                    else if (controller.name===this.state.expanded) 
                    {
                        this.setState({expanded: undefined}); 
                    }
                }; 
                return (
                    <MaterialUI.Accordion key={controller.name} onChange={AccordionChange} expanded={controller.name===this.state.expanded}>
                        <MaterialUI.AccordionSummary expandIcon={<MaterialUI.Icon>expand_more</MaterialUI.Icon>}>
                            <MaterialUI.Icon>{controller.icon}</MaterialUI.Icon>
                            <h4 className="ml-2">{controller.text}</h4>
                        </MaterialUI.AccordionSummary>
                        <MaterialUI.AccordionDetails>
                            <MaterialUI.List component="nav" className="width-full">
                                {
                                    controller.menu.filter(item=>window[item.action]).map
                                    (
                                        item=> (
                                            <MaterialUI.ListItem key={encodeURIComponent(JSON.stringify(item) + Math.random().toString())} className="m-1 p-0">
                                                <Link className={`icon-same-line-word width-full btn btn-${item.button}`} to={`/${this.props.building_id}/${controller.name}/${item.action}`}>
                                                    <MaterialUI.Icon>{item.icon}</MaterialUI.Icon>
                                                    <b className="ml-2">{item.text}</b>
                                                </Link>
                                            </MaterialUI.ListItem>
                                        )
                                    )
                                }
                            </MaterialUI.List>
                        </MaterialUI.AccordionDetails>
                    </MaterialUI.Accordion>
                ); 
            }
        ); 
        return (<React.Fragment>{sidebar}</React.Fragment>); 
    }
}

class PageWrapper extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        ExtendFromBaseComponent(this); 
        this.state = {sidebar: ServerJson("sidebar.json")}; 
    }
    render()
    {
        let redirect_component = this.CheckLogin(); 
        if(redirect_component)
        {
            return redirect_component; 
        }
        var Grid = MaterialUI.Grid; 
        var Route = ReactRouterDOM.Route; 
        return (
            <Grid container>
                <Grid className="p-1" item xs={3}>
                    <Sidebar {...this.state} building_id={this.props.match.params.building_id} />
                </Grid>
                <Grid className="p-3" item xs={9}>
                    <ReactRouterDOM.Switch>
                        {
                            this.state.sidebar.flatMap
                            (
                                controller => controller.menu.filter(item=>window[item.action]).map 
                                (
                                    item => <Route key={encodeURIComponent(JSON.stringify(item) + Math.random().toString())} component={window[item.action]} exact path={`/:building_id/:controller/${item.action}`} />
                                )
                            )
                        }
                    </ReactRouterDOM.Switch>
                </Grid>
            </Grid>
        ); 
    }
}

PageWrapper = ConnectComponentToStore(PageWrapper); 