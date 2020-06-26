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
                        action: "UserInput", 
                        a_text: "Add"
                    }, 
                    {
                        action: "ImportExport", 
                        a_text: "Import/Export"
                    }
                ], 

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
                            class="col"
                            v-bind="item"
                        >
                        </main-nav-item>

                    </div>
                
                </nav>
            </div>
        `
    }
); 
