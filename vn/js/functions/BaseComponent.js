class BaseComponent extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {}; 
    }
    static getDerivedStateFromProps(next_props, previous_state)
    {
        return null; 
    }
    Methods =
    {
        BuildingId()
        {
            return _.get(this.props, "match.params.building_id"); 
        }, 
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
            return `../server/database_controller/import.php?import_controller=${this.CurrentController()}&building_id=${this.BuildingId()}`; 
        }, 
        LoadForm(controller = undefined)
        {
            controller = controller || this.CurrentController(); 
            return UserInputForm(controller); 
        }, 
        ObjectId()
        {
            return this.props.object_id || ""; 
        }, 
        OverviewDataUrl(overview_controller, params=undefined)
        {
            params = 
            {
                building_id: this.BuildingId(), 
                overview_controller, 
                ...params
            }
            return `../server/overview_controller/overview_controller.php?${SearchQueryString(params)}`; 
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
        TableActions(controller)
        {
            return ServerJson(`../server/json/table_actions/vn/${controller}.json`) || {}; 
        }, 
        TableData(overview_controller, params=undefined)
        {
            var data = AjaxRequest(this.OverviewDataUrl(overview_controller, params));
            try 
            {
               return JSON.parse(data); 
            }
            catch (exception)
            {
                return []; 
            }          
        }, 
        ValidationHelperText(validations, props_name)
        {
            let name = this.props[props_name]; 
            let replace_name = UpperCaseFirstChar(name).replaceAll("_", " "); 
            return validations[name][0].replaceAll(replace_name, "").trim()
        }
    }
}