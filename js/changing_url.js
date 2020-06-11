function RedirectUrl(param, value)
{
    var search_params = (param=="controller")?"":window.location.search; 
    var url_params = new URLSearchParams(search_params); 
    url_params.set(param,value); 
    window.history.pushState(value,value,"?"+url_params.toString()); 
}

