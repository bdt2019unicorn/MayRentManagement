Vue.component
(
    "page-administration", 
    {
        mixins: [support_mixin], 
        data: ()=>({current_controller: "login"}), 
        methods: 
        {
            HandleLoginRegister(controller, data)
            {
                switch (controller) 
                {
                    case "login":
                        window.store_track.commit("Authorize", {username: data.username, user_id: data.user_id}); 
                        window.router.push({name: "dashboard"}); 
                        break;
                    case "user": 
                        this.current_controller = "login"; 
                        break; 
                }
            }
        },
        template: 
        `

            <div class="container-fluid">
                <div class="card">
                
                    <div class="card-header">
                        <div class="container-fluid">

                            <div class="row">
                                <div class="col"></div>
                                <router-link :to="{name: 'home'}"><img class="col" :src="StateObject('logo_src')" alt="logo"></router-link>
                                <div class="col"></div>
                            </div>
                            <br>
                            <div class="row">
                                <button :class="ItemsClasses('login', current_controller, ['btn', 'col'], 'btn-primary', 'bg-light')" @click="current_controller='login'">Login</button>
                                <button :class="ItemsClasses('user', current_controller, ['btn', 'col'], 'btn-primary', 'bg-light')" @click="current_controller='user'">Register</button>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <add :controller="current_controller" @authorize-controller-success="HandleLoginRegister" :permission="true"></add>
                    </div>

                </div>

            </div>

        `
    }
);