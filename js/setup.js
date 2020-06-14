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
                    action: "overview"
                }, 
                mutations: 
                {
                    ChangeController(state,payload)
                    {
                        state.controller = payload; 
                        state.action = "overview"; 
                    }
                }
            }

        );

        CreateNavbar();
        CreateWrapper(); 
    }
); 