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
        Emitter.emit("pageControllerUpdate", _.get(this.props, "match.params.controller")); 
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
        CheckLogin(redirect_component = <ReactRouterDOM.Redirect to="/page-administration/login" />, otherwise = null)
        {
            return !(this.props.username && this.props.user_id)? redirect_component: otherwise; 
        }, 
        CurrentController()
        {
            return this.props.controller || _.get(this.props, "match.params.controller"); 
        },  
        ImportUrl()
        {
            return `../server/database_controller/import.php?import_controller=${this.CurrentController()}&building_id=${_.get(this.props, "match.params.building_id")}`; 
        }, 
        LoadForm(controller = undefined)
        {
            controller = controller || this.CurrentController(); 
            try 
            {
                return ServerJson(`../server/user_input_controller/vn/${controller}.json`); 
            }
            catch (exception)
            {
                return undefined; 
            }
        }, 
        ResetStateValue({value_name, new_value, undefined_value=undefined, callback=undefined, callback_resolve=undefined})
        {
            new Promise 
            (
                (resolve, reject)=>
                {
                    this.setState({[value_name]: undefined_value}); 
                    if(callback)
                    {
                        callback(); 
                    }
                    resolve(new_value); 
                }
            ).then
            (
                new_value=>
                {
                    this.setState({[value_name]: new_value}); 
                    if(callback_resolve)
                    {
                        callback_resolve(); 
                    }
                }
            ); 
        }, 
        ValidationHelperText(validations, props_name)
        {
            let name = this.props[props_name]; 
            let replace_name = ( name.charAt(0).toUpperCase() + name.slice(1) ).replaceAll("_", " "); 
            return validations[name][0].replace(replace_name, "").trim()
        }
    }
}