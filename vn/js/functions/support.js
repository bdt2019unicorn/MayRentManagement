function AjaxRequest(url, data = new FormData(), type = "get")
{
    var result = undefined; 
    const request = new XMLHttpRequest(); 
    request.open(type, url, false); 
    UserInformation.Header(request); 
    request.onload = ()=> result = request.responseText; 
    request.send(data); 
    return result; 
}
function BlobRequest(url, data={})
{
    var result = undefined; 
    var form_data = new FormData(); 
    Object.keys(data).forEach(key=>form_data.append(key, data[key])); 
    const request = new XMLHttpRequest(); 
    request.overrideMimeType("text/plain; charset=x-user-defined"); 
    request.open("POST", url, false); 
    UserInformation.Header(request); 
    request.onload = ()=>
    {
        var bytes = new Uint8Array(request.responseText.length);
        for (var i = 0; i < request.responseText.length; i++) 
        {
            bytes[i] = request.responseText.charCodeAt(i);
        }
        result = new Blob([bytes], {type: "application/octetstream"}); 
    }; 
    request.onerror = function(error)
    {
        alert("There is something wrong with the server! Please try again"); 
        console.log(error); 
    }; 
    request.send(form_data); 
    return result; 
} 
function ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class="")
{
    return based_classes + " " + ((item_value==compared_value)?good_class: bad_class); 
} 
function NumeralFormat(number)
{
    return numbro(number).format({thousandSeparated: true});
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
    UserInformation.Submit(form_data); 
    return AjaxRequest(url, form_data, "post"); 
}
function TableAction(controller)
{
    return ServerJson(`../server/json/table_actions/vn/${controller}.json`) || {}; 
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
function TransformLowerCase(object)
{
    return _.transform(object, (result, value, key)=>result[key.toLowerCase()]=value); 
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
function ValidObject(object)
{
    return !(Object.values(object).includes(false));
} 
function ValidPeriod(start_period, end_period, equal=false)
{
    [start_period, end_period] = [start_period, end_period].map(period=>moment(period)); 

    let [str_start, str_end] = [start_period, end_period].map(moment_object=>DateReformat.Database(moment_object)); 
    if((str_start==str_end) && equal)
    {
        return true; 
    }
    return moment(str_end)>moment(str_start); 
}