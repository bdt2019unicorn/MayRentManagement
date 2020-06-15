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
        template: 
        `
            <li>
                <a class="nav-link" :href="Href">
                    <i style="font-size: xx-large;" :class="['fas', 'fa-'+ this.icon]"></i>
                    <p>{{p_text}}</p>
                </a>
            </li>
        `
    }
); 

function CreateNavbar()
{
    window.navbar = new Vue 
    (
        {
            el: "#page_navbar", 
            data: 
            {
                list_items: 
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
            methods: 
            {
                LiItemClass(item)
                {
                    var li_class = ["nav-item"]; 
                    if(window.store_track.state.controller==item.controller)
                    {
                        li_class.push("active"); 
                    }

                    return li_class; 
                }
            }
        }
    ); 
}


