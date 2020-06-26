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
                                building_id: "", 
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
                                SetStateAuthorize
                                (
                                    state, 
                                    {
                                        param, 
                                        value
                                    }
                                )
                                {
                                    state[param] = value; 
                                    sessionStorage.setItem(param, value); 
                                }, 

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

                                    var default_value = 
                                    {
                                        controller: "tenant", 
                                        action: "Overview"
                                    }; 
                                    var params_ranking = ["", "building_id", "controller", "action"]; 
                                    let current_search_params = new URLSearchParams(window.location.search); 
                                    let final_search_params = new URLSearchParams(); 
                                    let ranking_index = params_ranking.indexOf(param); 
                                    for (let index = 0; index < params_ranking.length; index++) 
                                    {
                                        if(index<ranking_index)
                                        {
                                            let current_value = current_search_params.get(params_ranking[index]); 
                                            console.log("param", params_ranking[index]); 
                                            console.log("current value ", current_value); 
                                            if(current_value)
                                            {
                                                final_search_params.set(params_ranking[index],current_value); 
                                            }
                                        }
                                        else if(index==ranking_index)
                                        {
                                            if(param)
                                            {
                                                final_search_params.set(param,value); 
                                                if(state[param]==value)
                                                {
                                                    continue; 
                                                }
                                                state[param] = value; 
                                                ResetValidation(); 
                                            }
                                        }
                                        else
                                        {
                                            this.state[params_ranking[index]] = (default_value[params_ranking[index]])?(default_value[params_ranking[index]]):""; 
                                        }
                                    }
                                    window.history.pushState(param,value,(param)?"?"+final_search_params.toString():window.location.pathname); 
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

        function InnitializeData(store_track)
        {
            function GetParamsData()
            {
                var search_params = window.location.search; 
                if(search_params.trim()=="")
                {
                    store_track.commit('RedirectUrl',{});
                    return; 
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
            }

            return new Promise 
            (
                (resolve, reject)=>
                {
                    GetParamsData(); 
                    store_track.commit
                    (
                        "SetStateAuthorize", 
                        {
                            param: "username", 
                            value: (sessionStorage.getItem("username"))?sessionStorage.getItem("username"):""
                        }
                    ); 
                    resolve(); 
                }
            ); 
        }
        
        CreateStoreTrack().then(InnitializeData).then(PageElements);
    }
); 