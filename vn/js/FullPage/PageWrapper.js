class Sidebar extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        let sidebar = AjaxRequest("sidebar.json"); 
        this.state = {sidebar: JSON.parse(sidebar), expanded: undefined}; 
    }
    render() 
    {
        var Link = ReactRouterDOM.Link; 
        var sidebar = this.state.sidebar.map 
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
                            <b className="ml-2">{controller.text}</b>
                        </MaterialUI.AccordionSummary>
                        <MaterialUI.AccordionDetails>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </MaterialUI.AccordionDetails>
                    </MaterialUI.Accordion>
                ); 
            }
        ); 
        return (
            <React.Fragment>
                {sidebar}
            </React.Fragment>           
        );
    }
}

class PageWrapper extends BaseComponent
{
    render()
    {
        if(!(this.props.username && this.props.user_id))
        {
            return <ReactRouterDOM.Redirect to="/page-administration/login" />; 
        }
        var Grid = MaterialUI.Grid; 
        return (
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Sidebar />
                </Grid>
                <Grid item xs={9}>
                    <div>page wrapper - test</div>
                </Grid>
            </Grid>
        ); 
    }
}

PageWrapper = ConnectComponentToStore(PageWrapper); 