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
    BuildingData = () =>
    {
        let buildings_data = this.TableData("buildings"); 
        try 
        {
            this.props.ChangeState({state_name: "buildings_data", value: buildings_data}); 
            return undefined; 
        }
        catch(exception)
        {
            return buildings_data; 
        }
    }
    BuildingId = () => _.get(this.props, "match.params.building_id")
    CheckLogin = (redirect_component = <ReactRouterDOM.Redirect to="/page-administration/login" />, otherwise = null) => !(this.props.username && this.props.user_id)? redirect_component: otherwise
    CurrentController = () => this.props.controller || _.get(this.props, "match.params.controller")
    ExecPropsFunction = (func, ...params) =>
    {
        if(this.props[func])
        {
            this.props[func](...params); 
        }
    }
    ImportUrl = () => `../server/controller/database/import.php?import_controller=${this.CurrentController()}&building_id=${this.BuildingId()}`
    LoadForm = (controller = undefined) => 
    {
        controller = controller || this.CurrentController(); 
        return UserInputForm(controller); 
    }
    ObjectId = () => 
    {
        if(this.props.object_id)
        {
            return this.props.object_id; 
        }
        var search_query_params = _.get(this.props.location, "search"); 
        search_query_params = new URLSearchParams(search_query_params); 
        return search_query_params.get("id") || ""; 
    }
    OverviewDataUrl = (overview_controller, params=undefined) => 
    {
        params = 
        {
            building_id: this.BuildingId(), 
            overview_controller, 
            ...params
        }
        return `../server/controller/overview/overview_controller.php?${SearchQueryString(params)}`; 
    } 
    OverviewUrl = () => this.OverviewDataUrl(this.CurrentController(), {id: this.ObjectId()})
    ResetStateValue = ({value_name, new_value, undefined_value=undefined, callback=undefined, callback_resolve=undefined}) => 
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
    }
    TableData = (overview_controller, params=undefined) => 
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
    }
    UpdateStateValueProperty = (state_name, property, value, extra_update = (new_state)=>null) => 
    {
        var new_state = ImmutabilityHelper 
        (
            this.state[state_name], 
            {
                [property]: {$set: value}
            }
        ); 
        extra_update(new_state); 
        this.setState({[state_name]: new_state}); 
    }
    ValidationHelperText = (validations, props_name) => 
    {
        let name = this.props[props_name]; 
        let replace_name = UpperCaseFirstChar(name).replaceAll("_", " "); 
        return validations[name][0].replaceAll(replace_name, "").trim()
    }
}