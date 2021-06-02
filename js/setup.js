jQuery
(
    function()
    {
        function CheckEnvironment()
        {
            let url = "server/controller/admin_database.php?command=CheckEnvironment"; 
            let result = support_mixin.methods.AjaxRequest(url); 
            if(!Number(result))
            {
                window.location.href = "admin/setup.php"; 
            }
        }

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
                            path: "/general-edit", 
                            redirect: 
                            {
                                name: "dashboard"
                            }
                        }, 
                        {
                            path: "/general-edit/:controller", 
                            name: "general-edit", 
                            component: general_edit
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
                    }
                    else
                    {
                        next(); 
                    }
                }
            ); 
            return router; 
        }

        function StoreTrack()
        {
            return new Vuex.Store
            (
                {
                    state: 
                    {
                        username: "", 
                        user_id: 0, 
                        user_permissions: undefined, 
                        buildings_data: [], 
                        building_user_input: {}, 
                        logo_src: ""
                    }, 
                    mutations: 
                    {
                        Authorize(state, payload)
                        {
                            let user_information = undefined; 
                            Object.keys(payload).forEach
                            (
                                key=>
                                {
                                    state[key] = payload[key]; 
                                    sessionStorage.setItem(key, payload[key]); 
                                    if(payload[key])
                                    {
                                        user_information = payload[key]; 
                                    }
                                }
                            );
                            if(user_information)
                            {
                                let url = `server/controller/overview/overview_controller.php?overview_controller=user&id=${payload.user_id}`;
                                user_information = support_mixin.methods.AjaxRequest(url); 
                                state.user_permissions = JSON.parse(user_information)[0]; 
                            }
                            else 
                            {
                                state.user_permissions = undefined; 
                            }
                        }, 
                        ChangeState(state, {name, value})
                        {
                            state[name] = value; 
                        }
                    }
                }
            );
        }

        function PageElements({router, store_track})
        {
            window.store_track = store_track; 
            window.router = router; 
            new Vue 
            (
                {
                    el: "#full-page", 
                    mixins:[permissions_mixin], 
                    created() 
                    {
                        let buildings_data = this.BuildingsData(); 
                        if(buildings_data)
                        {
                            store_track.commit("ChangeState", {name: "buildings_data", value: buildings_data}); 
                        }
                        let building_user_input = this.AjaxRequest("server/json/user_input/en/buildings.json");    
                        store_track.commit("ChangeState", {name: "building_user_input", value: building_user_input});  
                        store_track.commit("ChangeState", {name: "logo_src", value: `${this.AjaxRequest("server/controller/admin_database.php?command=LogoImg")}?q=${Date.now()}`});  
                        store_track.commit
                        (
                            "Authorize", 
                            {
                                username: sessionStorage.getItem("username") ||"", 
                                user_id: sessionStorage.getItem("user_id") ||""
                            }
                        ); 
                    },
                    router: router 
                }
            ); 
        }

        CheckEnvironment(); 
        new Promise ((resolve, reject)=>resolve({router: Router(), store_track: StoreTrack()})).then(PageElements);  
    }
); 