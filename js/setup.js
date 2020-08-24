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
                            name: "actions", 
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
                        buildings_data: [],
                        table_th_sticky: true 
                    }, 
                    mutations: 
                    {
                        Authorize(state, payload)
                        {
                            Object.keys(payload).forEach
                            (
                                key=>
                                {
                                    state[key] = payload[key]; 
                                    sessionStorage.setItem(key, payload[key]); 
                                }
                            );
                        }, 

                        ChangeState(state, {name, value})
                        {
                            state[name] = value; 
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

                        store_track.commit("ChangeState", {name: "buildings_data", value: this.buildings_data}); 
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