jQuery
(
    function()
    {
        function CreateStoreTrack()
        {
            return new Promise 
            (
                (resolve,reject)=>
                {
                    var store_track = new Vuex.Store
                    (
                        {
                            state: 
                            {
                                controller: "", 
                                action: "Overview"
                            }, 
                            mutations: 
                            {
                                RedirectUrl
                                (
                                    state, 
                                    {
                                        param="", 
                                        value=""
                                    }
                                )
                                {
                                    if(param=="")
                                    {
                                        window.history.pushState("","",window.location.pathname); 
                                        state.controller = ""; 
                                        state.action = "Overview"; 
                                        return; 
                                    }
                                    var search_params = (param=="controller")?"": window.location.search; 
                                    var url_params = new URLSearchParams(search_params); 
                                    url_params.set(param,value); 
                                    if(param=="controller")
                                    {
                                        state.controller = url_params.get(param); 
                                        state.action = "Overview"; 
                                    }
                                    else
                                    {
                                        state.action = url_params.get(param); 
                                    }
                                    window.history.pushState(value,value,"?"+url_params.toString()); 
                                }
                            }
                        }
            
                    );
                    window.store_track = store_track; 
                    resolve(store_track); 
                }
            )
        }

        function GetController(store_track)
        {
            return new Promise 
            (
                (resolve,reject)=>
                {
                    var search_params = window.location.search; 
                    if(search_params=="")
                    {
                        store_track.commit('RedirectUrl',{});
                        resolve(); 
                    }
                    var url_params = new URLSearchParams(search_params); 
                    url_params.forEach
                    (
                        (value, param)=>
                        {
                            store_track.commit
                            (
                                'RedirectUrl',
                                {
                                    param: param, 
                                    value: value
                                }
                            );
                        }
                    ); 
                    resolve(); 
                }
            )

        }

        CreateStoreTrack().then(GetController).then(PageElements);
    }
); 