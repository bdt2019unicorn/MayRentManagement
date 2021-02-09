class BaseComponent extends React.Component 
{
    constructor(props)
    {
        super(props); 
        this.state = {}; 
    }
    static getDerivedStateFromProps(next_props, previous_state)
    {
        return null; 
    }
    componentDidMount() 
    {
        if(this.CustomEvents)
        {
            Object.keys(this.CustomEvents).forEach(event=>Emitter.on(event, this.CustomEvents[event])); 
        }
    }
    componentWillUnmount() 
    {
        if(this.CustomEvents)
        {
            Object.keys(this.CustomEvents).forEach(event=>Emitter.off(event)); 
        }
    }
    static Methods =
    {
        CurrentController()
        {
            var controller; 
            try 
            {
                controller = this.props.match.params.controller; 
            }
            catch(error) {}
            return this.props.controller || controller; 
        },  
        LoadForm(controller = undefined)
        {
            controller = controller || this.CurrentController(); 
            let form = AjaxRequest(`../server/user_input_controller/vn/${controller}.json`); 
            return JSON.parse(form); 
        }, 
        ValidationHelperText(validations, props_name)
        {
            let name = this.props[props_name]; 
            let replace_name = ( name.charAt(0).toUpperCase() + name.slice(1) ).replaceAll("_", " "); 
            return validations[name][0].replace(replace_name, "").trim()
        }
    }
}