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
function BlobRequest(url, data={})
{
    console.log(data); 
    var result = undefined; 
    const request = new XMLHttpRequest(); 
    request.setRequestHeader('Content-Type', 'application/json');
    request.
    // request.responseType = "arraybuffer"; 
    request.open("POST", url, false); 
    request.onload = (result)=>
    {
        console.log(request.responseText); 
        console.log(result); 
        if(request.status==200)
        {
            var bytes = new Uint8Array(result.length);
            for (var i = 0; i < result.length; i++) 
            {
                bytes[i] = result.charCodeAt(i);
            }
            result = new Blob([bytes], {type: "application/octetstream"}); 
        }
    }; 
    request.onerror = function(error)
    {
        alert("There is something wrong with the server! Please try again"); 
        console.log(error); 
    }; 
    request.send(JSON.stringify(data)); 
    return result; 
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
function UpperCaseFirstChar(value) 
{
    return value.charAt(0).toUpperCase() + value.slice(1); 
}
function UserInputForm(controller)
{
    try 
    {
        return ServerJson(`../server/json/user_input/vn/${controller}.json`); 
    }
    catch (exception)
    {
        console.log(exception); 
        return undefined; 
    }
}