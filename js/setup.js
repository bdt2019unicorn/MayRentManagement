jQuery
(
    function()
    {
        window.store_track = new Vuex.Store
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
                            state.action = ""; 
                            return; 
                        }
                        var search_params = (param=="controller")?"": window.location.search; 
                        var url_params = new URLSearchParams(search_params); 
                        url_params.set(param,value); 
                        if(param=="controller")
                        {
                            state.controller = url_params.get(param); 
                        }
                        window.history.pushState(value,value,"?"+url_params.toString()); 
                    }
                }
            }

        );

        function GetController()
        {
            var search_params = window.location.search; 
            if(search_params=="")
            {
                window.store_track.commit('RedirectUrl',{});
                return; 
            }
            var url_params = new URLSearchParams(search_params); 
            url_params.forEach
            (
                (value, param)=>
                {
                    window.store_track.commit
                    (
                        'RedirectUrl',
                        {
                            param: param, 
                            value: value
                        }
                    );
                }
            ); 
        }

        GetController(); 
        CreateNavbar();
        CreateWrapper(); 
    }
); 
