var li_nav_item = Vue.component 
(
    "li-nav-item", 
    {
        props: ["icon", "p_text", "controller"], 
        computed: 
        {
            Href()
            {
                return "javascript:window.store_track.commit('RedirectUrl', {param: 'controller',value:'" + this.controller + "'});"
            }
        }, 
        methods: 
        {
            LiItemClass()
            {
                var li_class = ["nav-item"]; 
                if(window.store_track.state.controller==this.controller)
                {
                    li_class.push("active"); 
                }

                return li_class; 
            }
        },
        template: 
        `
            <li :class="LiItemClass">
                <a class="nav-link" :href="Href">
                    <i style="font-size: xx-large;" :class="['fas', 'fa-'+ this.icon]"></i>
                    <p>{{p_text}}</p>
                </a>
            </li>
        `
    }
); 

var page_navbar = Vue.component
(
    "page-navbar", 
    {
        data: 
        {
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
        },  
        template: 
        `
            <nav class="navbar navbar-expand-lg navbar-light">
                <a class="navbar-brand" href="javascript:window.store_track.commit('RedirectUrl',{});" style="width: 20%;">
                    <img src="img/logo.jpeg" alt="logo" style="height: 10vmin;">
                </a>

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


function PageElements()
{
    window.full_page = new Vue 
    (
        {
            el: "#full_page", 
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
            }
        }
    ); 
}