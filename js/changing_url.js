function RedirectUrl(param="", value="")
{
    if(param=="")
    {
        window.history.pushState("","",window.location.pathname); 
        window.store_track.commit("ChangeController", ""); 
        return; 
    }
    var search_params = (param=="controller")?"": window.location.search; 
    var url_params = new URLSearchParams(search_params); 
    url_params.set(param,value); 
    if(param=="controller")
    {
        window.store_track.commit("ChangeController", url_params.get(param)); 
    }
    window.history.pushState(value,value,"?"+url_params.toString()); 
}

