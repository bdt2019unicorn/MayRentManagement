var side_bar = Vue.component
(
    "side-bar", 
    {
        data()
        {
            return {
                list_items: 
                [
                    {
                        action: "Overview", 
                        a_text: "Overview"
                    }, 
                    {
                        action: "Add", 
                        a_text: "Add"
                    }, 
                    {
                        action: "ImportExport", 
                        a_text: "Import/Export"
                    }
                ]
            }
        }, 

        template: 
        `
            <div class="side-bar">
                <nav class="navbar bg-light">

                    <ul class="navbar-nav">
                        <nav-item
                            v-for="item in list_items" 
                            :a_text=item.a_text 
                            :action=item.action
                        >
                        </nav-item>
                    </ul>
                
                </nav>
            </div>
        `
    }
); 

var nav_item = Vue.component
(
    "nav-item", 
    {
        props: ["a_text", "action"], 
        computed: 
        {
            Href()
            {
                return "javascript:window.store_track.commit('RedirectUrl', {param: 'action',value:'" + this.action + "'});"; 
            }
        }, 
        template: 
        `
            <li class="nav-item">
                <a class="nav-link" :href="Href">{{a_text}}</a>
            </li>
        `
    }
); 