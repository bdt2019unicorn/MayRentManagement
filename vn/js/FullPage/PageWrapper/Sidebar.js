class Sidebar extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {expanded: undefined}; 
        ExtendFromBaseComponent(this); 
    }
    render() 
    {
        var Link = ReactRouterDOM.Link; 
        var current_controller = this.CurrentController(); 
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
                        <MaterialUI.AccordionSummary className={(controller.name==current_controller)?"bg-yellow": undefined} expandIcon={<MaterialUI.Icon>expand_more</MaterialUI.Icon>}>
                            <MaterialUI.Icon>{controller.icon}</MaterialUI.Icon>
                            <h4 className="ml-2">{controller.text}</h4>
                        </MaterialUI.AccordionSummary>
                        <MaterialUI.AccordionDetails>
                            <MaterialUI.List component="nav" className="width-full">
                                {
                                    controller.menu.filter(item=>window[item.action]).map
                                    (
                                        item=> 
                                        (
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