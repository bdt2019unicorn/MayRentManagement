jQuery
(
    function()
    {

        function Router()
        {
            const router = new VueRouter
            (
                {
                    routes: 
                    [
                        {
                            path: "/", 
                            name: "home"
                        }, 
                        {
                            path: "/dashboard", 
                            name: "dashboard", 
                            component: dashboard 
                        }, 
                        {
                            path: "/user", 
                            name: "user", 
                            component: user 
                        }, 
                        {
                            path: "/:building_id", 
                            component: page_wrapper, 
                            props: true 
                        }, 
                        {
                            path:"/:building_id/:controller", 
                            component: page_wrapper, 
                            props: true 
                        }, 
                        {
                            path:"/:building_id/:controller/:action", 
                            component: page_wrapper, 
                            props: true 
                        }
                    ]
                }
            ); 
            router.beforeEach
            (
                (to, from, next) => 
                {
                    if(to.name!="home" && !sessionStorage.getItem("username"))
                    {
                        next({name: "home"}); 
                    }
                    else if (to.name=="home" && sessionStorage.getItem("username"))
                    {
                        next("dashboard"); 
                        window.location.reload(); 
                    }
                    next(); 
                }
            ); 
            return router; 
        }


        function StoreTrack()
        {
            var store_track = new Vuex.Store
            (
                {
                    state: 
                    {
                        username: "", 
                        user_id: 0, 
                        buildings_data: []
                    }, 
                    mutations: 
                    {
                        Authorize(state, {username, user_id})
                        {
                            state["username"] = username; 
                            state["user_id"] = user_id; 
                            sessionStorage.setItem("username", username); 
                            sessionStorage.setItem("user_id", user_id); 
                        }, 

                        BuildingsData(state, payload)
                        {
                            state.buildings_data = payload; 
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
                            var default_value = 
                            {
                                controller: "overview", 
                                action: "overview"
                            }; 
                            var params_ranking = ["", "building_id", "controller", "action", "object_id"]; 
                            let current_search_params = new URLSearchParams(window.location.search); 
                            let final_search_params = new URLSearchParams(); 
                            let ranking_index = params_ranking.indexOf(param); 
                            for (let index = 0; index < params_ranking.length; index++) 
                            {
                                if(index<ranking_index)
                                {
                                    let current_value = current_search_params.get(params_ranking[index]); 
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
                                    }
                                }
                                else
                                {
                                    this.state[params_ranking[index]] = (default_value[params_ranking[index]])?(default_value[params_ranking[index]]):""; 
                                }
                            }
                            window.history.pushState(param,value,(param)?"?"+final_search_params.toString():window.location.pathname); 
                        }
                    }
                }
    
            );
            return store_track; 
        }

        function PageElements({router, store_track})
        {
            window.store_track = store_track; 
            window.router = router; 
            new Vue 
            (
                {
                    el: "#full_page", 
                    mixins:[support_mixin], 
                    data: 
                    {
                        buildings_data: []
                    }, 
                    created() 
                    {
                        this.buildings_data = this.TableData("buildings"); 
                        for(var index=0; index<this.buildings_data.length; index++)
                        {
                            this.buildings_data[index]["params"] = 
                            {
                                building_id: this.buildings_data[index]["id"]
                            }
                        }

                        store_track.commit("BuildingsData", this.buildings_data); 
                        store_track.commit
                        (
                            "Authorize", 
                            {
                                username: (sessionStorage.getItem("username"))?sessionStorage.getItem("username"):"", 
                                user_id: (sessionStorage.getItem("user_id"))?sessionStorage.getItem("user_id"):""
                            }
                        ); 
                    },
                    router: router 
                }
            ); 
        }

        new Promise 
        (
            (resolve, reject)=>
            {
                resolve({router: Router(), store_track: StoreTrack()}); 
            }
        ).then(PageElements); 
    }
); 