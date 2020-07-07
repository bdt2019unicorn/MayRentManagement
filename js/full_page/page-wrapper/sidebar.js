Vue.component
(
    "side-bar", 
    {
        data()
        {
            return {
                nav_list_items: 
                [
                    {
                        controller: "apartment", 
                        icon: "bed", 
                        name: "Apartments"
                    }, 
                    {
                        controller: "tenant", 
                        icon: "users", 
                        name: "Tenants"
                    }, 
                    {
                        controller: "leaseagrm", 
                        icon: "handshake",
                        name: "Lease Agreement"
                    }, 
                    {
                        controller: "revenue", 
                        icon: "hand-holding-usd",
                        name: "Income"
                    }, 
                    {
                        controller: "expense", 
                        icon: "file-invoice-dollar",
                        name: "Expenses"
                    }
                ]
            }
        }, 
        mixins: [support_mixin], 
        template: 
        `
            <div class="side-bar">
                <nav class="navbar container-fluid">

                    <div 
                        class="row"
                        style="margin:0.5vh 0; width: 100%;"
                        v-for="item in nav_list_items" 
                        
                    >
                        <main-nav-item 
                            :class="ItemsClasses(item.controller, StateObject('controller'), ['btn', 'col'], 'btn-warning', 'btn-primary')" 
                            v-bind="item"
                        >
                        </main-nav-item>

                    </div>
                
                </nav>
            </div>
        `
    }
); 
