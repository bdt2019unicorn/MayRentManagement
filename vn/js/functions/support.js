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

const Emitter = new EventEmitter();

function ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class="")
{
    return based_classes + " " + ((item_value==compared_value)?good_class: bad_class); 
} 