function BindFucntions(component)
{
    Object.keys(component.Methods).forEach(func=>component[func] = component.Methods[func].bind(component)); 
}

function AjaxRequest(url, data = new FormData(), type = "get")
{
    var result = undefined; 
    const request = new XMLHttpRequest(); 
    request.open(type, url, false); 
    request.onload = ()=> result = request.responseText; 
    request.send(data); 
    return result; 
}