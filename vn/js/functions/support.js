function AjaxRequest(url, data = new FormData(), type = "get")
{
    var result = undefined; 
    const request = new XMLHttpRequest(); 
    request.open(type, url, false); 
    request.onload = ()=> result = request.responseText; 
    request.send(data); 
    return result; 
}
function BindFunctions(component)
{
    if(!component.Methods)
    {
        return; 
    }
    Object.keys(component.Methods).forEach(func => component[func] = component.Methods[func].bind(component)); 
}
function ConnectComponentToAll(component_class)
{
    return ConnectComponentToRouter(ConnectComponentToStore(component_class)); 
}
function ConnectComponentToRouter(component_class)
{
    return ReactRouterDOM.withRouter(component_class); 
}
function ConnectComponentToStore(component_class)
{
    return ReactRedux.connect(PageSetup.MapStateToProps, PageSetup.MapDispatchToProps)(component_class); 
}
function DateFormatDisplay(moment_value) 
{
    return moment(moment_value).format("DD/MM/YYYY"); 
}
function ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class="")
{
    return based_classes + " " + ((item_value==compared_value)?good_class: bad_class); 
} 
function SearchQueryString(params)
{
    return Object.keys(params).filter(key=>params[key]!=undefined).map(key=>`${key}=${params[key]}`).join("&"); 
}
function ServerJson(url)
{
    try 
    {
        let json = AjaxRequest(url); 
        return JSON.parse(json); 
    }
    catch 
    {
        return undefined; 
    }
}
function SubmitData(key, url, data, stringify=true) 
{
    var form_data = new FormData(); 
    form_data.append(key, (stringify)?JSON.stringify(data): data); 
    SubmitUserInformation(form_data); 
    return AjaxRequest(url, form_data, "post"); 
}
function SubmitUserInformation(form_data)
{
    try 
    {
        form_data.append("username", sessionStorage.getItem("username")); 
        form_data.append("modified_time", moment().format("YYYY-MM-DD HH:MM:ss")); 
    }
    catch(error) {}
} 
function ToActions({params, query}) 
{
    let {building_id, controller, action} = params; 
    action = UpperCaseFirstChar(action || ""); 
    return {
        pathname: "/" + [building_id, controller, action].filter(value=>value).join("/"), 
        search: SearchQueryString(query)
    };
}
function TranslateTable(table, url) 
{
    var translate = ServerJson(url); 
    return translate ? table.map
    (
        row=>Object.keys(row).reduce
        (
            (accumulator, current_value)=>
            (
                {
                    ...accumulator, 
                    [translate[current_value] || current_value]: row[current_value]
                }
            ), {}
        ) 
    ) : table; 
}
function UpperCaseFirstChar(value) 
{
    return value.charAt(0).toUpperCase() + value.slice(1); 
}
function UserInputForm(controller)
{
    try 
    {
        return ServerJson(`../server/user_input_controller/vn/${controller}.json`); 
    }
    catch (exception)
    {
        console.log(exception); 
        return undefined; 
    }
}