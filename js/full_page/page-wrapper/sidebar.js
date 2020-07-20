Vue.component
(
    "side-bar", 
    {
        mixins: [support_mixin], 
        data()
        {
            return {
                nav_list_items: 
                [
                    {
                        icon: "bed", 
                        name: "Apartments", 
                        params: 
                        {
                            controller: "apartment"
                        }
                    }, 
                    {
                        icon: "users", 
                        name: "Tenants", 
                        params: 
                        {
                            controller: "tenant"
                        }
                    }, 
                    {
                        icon: "handshake",
                        name: "Lease Agreement", 
                        params: 
                        {
                            controller: "leaseagrm"
                        }
                    }, 
                    {
                        icon: "hand-holding-usd",
                        name: "Income", 
                        params: 
                        {
                            controller: "revenue"
                        }
                    }, 
                    {
                        icon: "file-invoice-dollar",
                        name: "Expenses", 
                        params: 
                        {
                            controller: "expense"
                        }
                    }, 
                    {
                        icon: "cog",
                        name: "Utilities", 
                        params: 
                        {
                            controller: "utilities", 
                            action: "UtilitiesOverview"
                        }
                    }
                ]
            }
        }, 
        template: 
        `
            <div class="side-bar">
                <nav class="navbar container-fluid">
                    <div class="row" style="margin:0.5vh 0; width: 100%;" v-for="item in nav_list_items">
                        
                        <a-hyperlink 
                            :class="ItemsClasses(item.params.controller, StateObject('controller'), ['btn', 'col'], 'btn-warning', 'btn-primary')" 
                            style="text-align: center;" 
                            :params="item.params" 
                        >
                            <i style="font-size: xx-large;" :class="['fas', 'fa-'+ item.icon]"></i>
                            <p>{{item.name}}</p>
                        </a-hyperlink>
                    </div>
                </nav>
            </div>
        `
    }
); 
