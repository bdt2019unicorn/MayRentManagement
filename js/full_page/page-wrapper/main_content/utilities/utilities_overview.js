Vue.component
(
    "UtilitiesOverview", 
    {
        props: [], 
        mixins: [support_mixin], 
        data()
        {
            return {
                apartment_id: "", 
                just_started_parent: true, 
                select_data: 
                [
                    {
                        id: 1, 
                        value: "electric"
                    }, 
                    {
                        id: 2, 
                        value: "water"
                    }
                ], 
                table_data: 
                [
                    {
                        id: 1, 
                        name: "test"
                    }, 
                    {
                        id: 2, 
                        name: "test"
                    }
                ], 
                utility_id: "", 
                test_picker: false, 
                vmodel: undefined
            }
        }, 
        components: {FunctionalCalendar}, 
        mounted() 
        {
            ChooseDate = ()=>
            {
                return new Promise
                (
                    (resolve,reject)=>
                    {
                        this.$refs["Calendar"].ChooseDate("today"); 
                        resolve(); 
                    }
                ); 
            }; 
            ChooseDate().then
            (
                ()=>
                {
                    this.vmodel.dateRange.start="2020-7-1"; 
                    this.vmodel.dateRange.end="2020-7-21"; 
                }
            );
        },
        methods: 
        {
            TestBtn()
            {
                
                this.test_picker = !this.test_picker; 
            }, 
            TestClickedRange()
            {
                console.log("ranged"); 
                console.log(this.vmodel); 
            }
        },
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>

                <div class="row">
                    <form class="container-fluid col">  
                        <div class="row">
                            <select-input :select_data="select_data" select_value="id" text="value" option_title="All Utilities" not_required="true"></select-input>
                            <select-input :select_data="select_data" select_value="id" text="value" option_title="All Utilities" not_required="true"></select-input>
                            <div class="col-2">
                                <button class="btn btn-primary">Search</button>
                            </div>
                        </div>

                        <div class="row">
                            <input type="text" class="form-control" @click="TestBtn">
                            <FunctionalCalendar 
                                v-show='test_picker' 
                                class="col"
                                dateFormat="yyyy-mm-dd" 
                                :is-date-range='true' 
                                v-model="vmodel" 
                                @dayClicked="TestClickedRange" 
                                ref="Calendar"
                            ></FunctionalCalendar>
                        </div>
                    </form>
                </div>
                <scrolling-table :table_data="table_data"></scrolling-table>

            </div>
        `
    }
); 