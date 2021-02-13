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

function ConnectComponentToStore(component_class)
{
    return ReactRedux.connect(PageSetup.MapStateToProps, PageSetup.MapDispatchToProps)(component_class); 
}

function ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class="")
{
    return based_classes + " " + ((item_value==compared_value)?good_class: bad_class); 
} 

function ServerJson(url)
{
    let json = AjaxRequest(url); 
    return JSON.parse(json); 
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