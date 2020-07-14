Vue.component
(
    "page-navbar", 
    {
        props: ["buildings_data", "grid_area_surfix"], 
        mixins: [support_mixin], 
        methods: 
        {
            Logout()
            {
                window.store_track.commit
                (
                    "SetStateAuthorize", 
                    {
                        param: "username", 
                        value: ""
                    }
                ); 
                window.store_track.commit("RedirectUrl",{}); 
            }, 
            ManageMyAccount()
            {
                window.store_track.commit("RedirectUrl",{}); 
                window.store_track.commit
                (
                    "RedirectUrl",
                    {
                        param: "controller", 
                        value: "user"
                    }
                ); 
            }
        },

        template: 
        `   
            <nav class="navbar navbar-expand-lg top-page-nav">

                <logo-image
                    style="grid-area: logo;"
                    img_class="top-logo-img"
                >
                </logo-image>

                <main-nav-items
                    class="main-nav-items"
                    v-if="StateObject('building_id')"
                    :buildings_data="buildings_data"
                    default_icon="building"
                    :grid_area_surfix="grid_area_surfix"
                >
                </main-nav-items>

                <div class="container-fluid" style="grid-area: username;">

                    <div class="btn-group">
                        <button class="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img style="width:5vw;" src="img/logo.jpeg" alt="logo">
                            <p>{{StateObject('username')}}</p>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                            <button class="btn dropdown-item" @click="ManageMyAccount">Manage your Account</button>
                            <button class="btn dropdown-item" @click="Logout">Logout</button>
                        </div>
                    </div>

                </div>

            </nav>
        `
    }
);

Vue.component 
(
    "page-wrapper", 
    {
        mixins: [support_mixin], 
        template: 
        `
        <div class="wrapper">

            <side-bar></side-bar>
            <div class="main-content">
                <component :is="StateObject('action')" :object_id="StateObject('object_id')"></component>
            </div>

        </div>



        `
    }
); 

Vue.component
(
    "page-administration", 
    {
        mixins: [support_mixin], 
        data()
        {
            return {
                current_controller: "login"
            }
        }, 
        methods: 
        {
            HandleLoginRegister(controller, data)
            {
                switch (controller) 
                {
                    case "login":
                        window.store_track.commit
                        (                        
                            "SetStateAuthorize", 
                            {
                                param: "username", 
                                value: data.username
                            }
                        ); 

                        window.store_track.commit
                        (                        
                            "SetStateAuthorize", 
                            {
                                param: "user_id", 
                                value: data.user_id
                            }
                        ); 
                        
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
                                <logo-image img_class="col"></logo-image>
                                <div class="col"></div>
                            </div>

                            <br>

                            <div class="row">

                                <button 
                                    :class="ItemsClasses('login', current_controller, ['btn', 'col'], 'btn-primary', 'bg-light')" 
                                    @click="current_controller='login'"
                                >
                                    Login
                                </button>

                                <button 
                                    :class="ItemsClasses('user', current_controller, ['btn', 'col'], 'btn-primary', 'bg-light')" 
                                    @click="current_controller='user'"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <add :controller="current_controller" @authorize-controller-success="HandleLoginRegister"></add>
                    </div>

                </div>

            </div>


        `
    }
); 

function PageElements()
{
    window.full_page = new Vue 
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
            },
        }
    ); 
}