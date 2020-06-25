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
                                username: "", 
                                controller: "", 
                                action: "Overview", 
                                validation: 
                                {
                                    date_required: true,
                                    date_group_valid: true
                                }, 
                                date_required: 
                                {
                                    current: 0, 
                                    total: 0 
                                }, 
                                date_group_valid: 
                                {
                                    current: 0, 
                                    total: 0 
                                }
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
                                    function ResetValidation()
                                    {
                                        state.validation = 
                                        {
                                            date_required: true,
                                            date_group_valid: true
                                        }; 
                                        state.date_required = 
                                        {
                                            current: 0, 
                                            total: 0 
                                        }; 
                                        state.date_group_valid = 
                                        {
                                            current: 0, 
                                            total: 0 
                                        }; 
                                    }

                                    function ChangeController(new_controller="")
                                    {
                                        state.controller = new_controller; 
                                        state.action = "Overview"; 
                                        ResetValidation(); 
                                    }

                                    if(param=="")
                                    {
                                        window.history.pushState("","",window.location.pathname); 
                                        ChangeController(); 
                                        return; 
                                    }
                                    var search_params = (param=="controller")?"": window.location.search; 
                                    var url_params = new URLSearchParams(search_params); 
                                    url_params.set(param,value); 
                                    if(param=="controller")
                                    {
                                        ChangeController(url_params.get(param)); 
                                    }
                                    else
                                    {
                                        state.action = url_params.get(param); 
                                        ResetValidation(); 
                                    }
                                    window.history.pushState(value,value,"?"+url_params.toString()); 
                                }, 
                                DateCurrent(state, {name, value})
                                {
                                    let number = (value==true)?1:-1; 
                                    state[name]["current"]+=number; 
                                    state.validation[name] = (state[name]["current"]==state[name]["total"]); 
                                }, 
                                DateTotal(state, {name,value})
                                {
                                    state[name].total++; 
                                    state[name].current+= Number(value); 
                                    state.validation[name] = (state[name]["current"]==state[name]["total"]); 
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