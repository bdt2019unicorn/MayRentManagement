Vue.component
(
    "page-navbar", 
    {
        props: ["buildings_data"], 
        mixins: [support_mixin], 
        template: 
        `   
            <nav class="navbar navbar-expand-lg top-page-nav">

                <router-link :to="{name: 'dashboard'}" style="grid-area: logo;">
                    <img class="top-logo-img" src="img/logo.jpeg" alt="logo">
                </router-link>

                <main-nav-items class="main-nav-items" :buildings_data="buildings_data" default_icon="building"></main-nav-items>

                <div class="container-fluid" style="grid-area: username;">

                    <div class="btn-group">
                        <button class="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img style="width:5vw;" src="img/logo.jpeg" alt="logo">
                            <p>{{StateObject('username')}}</p>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                            <router-link class="btn dropdown-item" :to="{name: 'user'}">Manage your Account</router-link>
                            <button 
                                class="btn dropdown-item" 
                                onclick="window.store_track.commit('Authorize', {username: '', user_id: ''}); window.router.push({name: 'home'}).catch(error=>{});"
                            >Logout</button>
                        </div>
                    </div>

                </div>

            </nav>
        `
    }
);

Vue.component
(
    "side-bar", 
    {
        mixins: [support_mixin], 
        data()
        {
            return {
                nav_list_items: []
            }
        }, 
        created() 
        {
            this.nav_list_items = this.AjaxRequest("server/sidebar.json"); 
        },
        methods: 
        {
            IconClass(icon)
            {
                return ['fas', 'fa-'+ icon]; 
            }
        }, 
        template: 
        `
            <vs-collapse type="margin" accordion class="side-bar"> 
                <vs-collapse-item v-for="item in nav_list_items"> 
                    <button
                        slot="header"
                        :class="ItemsClasses(item.name, $route.params.controller, ['w-100', 'btn'], 'btn-warning', 'btn-primary')" 
                    >
                        <i style="font-size: xx-large;" :class="IconClass(item.icon)"></i>
                        <br>
                        <span>{{item.text}}</span>
                    </button>

                    <ul class="list-unstyled w-100" :id="item.name">
                        <li v-for="link in item.menu">
                            <router-link 
                                :class="['w-100', 'btn', 'btn-'+link.button]" 
                                :to="ToActions({controller: item.name, action: link.action})" 
                                :title="link.title"  
                            >
                                <i :class="IconClass(link.icon)"></i>&nbsp;{{link.text}}
                            </router-link>
                        </li>
                    </ul>
                </vs-collapse-item> 

            </vs-collapse>
        `
    }
); 

var page_wrapper = Vue.component 
(
    "page-wrapper", 
    {
        props: ["building_id"], 
        mixins: [support_mixin], 
        template: 
        `
            <div class="wrapper">
                <side-bar></side-bar>
                <div class="main-content">
                    <component :is="$route.params.action || 'overview'"></component>
                </div>
            </div>

        `
    }
); 

var user = Vue.component
(
    "user", 
    {
        mixins: [support_mixin], 
        template: `<edit controller="user" form_title="Edit My Information" :object_id="StateObject('user_id')"></edit>`
    }
); 