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
                            path: "/:building_id", 
                            component: page_wrapper, 
                            props: true 
                        }, 
                        {
                            path:"/:building_id/:controller", 
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
                    if(!to.name && !sessionStorage.getItem("username"))
                    {
                        next("/"); 
                    }
                    else 
                    {
                        next(); 
                    }
                }
            ); 
            window.router = router; 
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
                        object_id: 0, 
                        building_id: "", 
                        controller: "", 
                        action: "Overview"
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
            // return new Promise 
            // (
            //     (resolve,reject)=>
            //     {
            //         var store_track = new Vuex.Store
            //         (
            //             {
            //                 state: 
            //                 {
            //                     username: "", 
            //                     user_id: 0, 
            //                     object_id: 0, 
            //                     building_id: "", 
            //                     controller: "", 
            //                     action: "Overview"
            //                 }, 
            //                 mutations: 
            //                 {
            //                     SetStateAuthorize
            //                     (
            //                         state, 
            //                         {
            //                             param, 
            //                             value
            //                         }
            //                     )
            //                     {
            //                         state[param] = value; 
            //                         sessionStorage.setItem(param, value); 
            //                     }, 

            //                     RedirectUrl
            //                     (
            //                         state, 
            //                         {
            //                             param="", 
            //                             value=""
            //                         }
            //                     )
            //                     {
            //                         var default_value = 
            //                         {
            //                             controller: "overview", 
            //                             action: "overview"
            //                         }; 
            //                         var params_ranking = ["", "building_id", "controller", "action", "object_id"]; 
            //                         let current_search_params = new URLSearchParams(window.location.search); 
            //                         let final_search_params = new URLSearchParams(); 
            //                         let ranking_index = params_ranking.indexOf(param); 
            //                         for (let index = 0; index < params_ranking.length; index++) 
            //                         {
            //                             if(index<ranking_index)
            //                             {
            //                                 let current_value = current_search_params.get(params_ranking[index]); 
            //                                 if(current_value)
            //                                 {
            //                                     final_search_params.set(params_ranking[index],current_value); 
            //                                 }
            //                             }
            //                             else if(index==ranking_index)
            //                             {
            //                                 if(param)
            //                                 {
            //                                     final_search_params.set(param,value); 
            //                                     if(state[param]==value)
            //                                     {
            //                                         continue; 
            //                                     }
            //                                     state[param] = value; 
            //                                 }
            //                             }
            //                             else
            //                             {
            //                                 this.state[params_ranking[index]] = (default_value[params_ranking[index]])?(default_value[params_ranking[index]]):""; 
            //                             }
            //                         }
            //                         window.history.pushState(param,value,(param)?"?"+final_search_params.toString():window.location.pathname); 
            //                     }
            //                 }
            //             }
            
            //         );
            //         window.store_track = store_track; 
            //         resolve(store_track); 
            //     }
            // )
        }

        function PageElements(store_track)
        {
            window.store_track = store_track; 
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

                        store_track.commit
                        (
                            "SetStateAuthorize", 
                            {
                                param: "username", 
                                value: (sessionStorage.getItem("username"))?sessionStorage.getItem("username"):""
                            }
                        ); 
    
                        store_track.commit
                        (
                            "SetStateAuthorize", 
                            {
                                param: "user_id", 
                                value: (sessionStorage.getItem("user_id"))?sessionStorage.getItem("user_id"):""
                            }
                        ); 
                    },
                }
            ); 
        }

        new Promise 
        (
            (resolve, reject)=>
            {
                Router(); 
                resolve(StoreTrack()); 
            }
        ).then(PageElements); 
    }
); 