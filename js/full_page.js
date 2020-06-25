var page_navbar = Vue.component
(
    "page-navbar", 
    {
        data()
        {
            return {
                nav_list_items: 
                [
                    {
                        controller: "buildings", 
                        icon: "building", 
                        p_text: "Buildings"
                    }, 
                    {
                        controller: "tenant", 
                        icon: "users", 
                        p_text: "Tenants"
                    }, 
                    {
                        controller: "leaseagrm", 
                        icon: "handshake",
                        p_text: "Lease Agreement"
                    }, 
                    {
                        controller: "revenue", 
                        icon: "hand-holding-usd",
                        p_text: "Income"
                    }, 
                    {
                        controller: "expense", 
                        icon: "file-invoice-dollar",
                        p_text: "Expenses"
                    }
                ]
            } 
        }, 
        template: 
        `
            <nav class="navbar navbar-expand-lg navbar-light">

                <logo-image
                    :a_class="['navbar-brand', 'top-logo-a-wrapper']"
                    img_class="top-logo-img"
                >
                </logo-image>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav nav-fill w-100">

                        <li-nav-item 
                            v-for="item in nav_list_items" 
                            :icon="item.icon"
                            :p_text="item.p_text"
                            :controller="item.controller"
                        >
                        </li-nav-item>

                    </ul>
                </div>
            </nav>
        `
    }
);

var page_wrapper = Vue.component 
(
    "page-wrapper", 
    {
        computed: 
        {
            ShowWrapper: function()
            {
                return (window.store_track.state.controller!=''); 
            }, 
            Action: function()
            {
                return window.store_track.state.action; 
            } 
        }, 
        template: 
        `
        <div v-if="ShowWrapper" class="wrapper">

            <side-bar></side-bar>
            <div class="main-content container-fluid">
                <div class="row" style="height: 5vh;"></div>
                <component
                    :is="Action"
                >
                </component>
            </div>

        </div>



        `
    }
); 

var page_administration = Vue.component
(
    "page-administration", 
    {
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
                        console.log("I am feeling good"); 
                        break;
                    case "register": 
                        this.current_controller = "login"; 
                        break; 
                }
            }, 
            ButtonClass(controller)
            {
                let button_class = ["btn", "col"]; 
                if(controller==this.current_controller)
                {
                    button_class.push("btn-primary"); 
                }
                else
                {
                    button_class.push("bg-light"); 
                }
                return button_class; 
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
                                    :class="ButtonClass('login')" 
                                    @click="current_controller='login'"
                                >
                                    Login
                                </button>

                                <button 
                                    :class="ButtonClass('register')" 
                                    @click="current_controller='register'"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <Add :controller="current_controller" @valid-controller-success="HandleLoginRegister"></Add>
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
            computed: 
            {
                Authorize()
                {
                    return (window.store_track.state.username!=""); 
                }
            }
        }
    ); 
}