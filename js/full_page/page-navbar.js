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
            }, 
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

var logo_image = Vue.component
(
    "logo-image", 
    {
        props: ["a_class", "img_class"], 
        template: 
        `
            <a 
                :class="a_class" 
                href="javascript:window.store_track.commit('RedirectUrl',{});"
            >
                <img :class="img_class" src="img/logo.jpeg" alt="logo">
            </a>
        `
    }
); 