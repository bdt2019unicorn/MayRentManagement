Vue.component
(
    "utility-reading", 
    {
        mixins: [utilities_mixin], 
        data() 
        {
            return {
                test_model: "Test Edit"        
            }
        },
        methods: 
        {
            TestInput(event)
            {
                console.log("input test"); 
                this.test_model = event.target.innerText; 
            }    
        },
        watch: 
        {
            test_model: function(new_value, old_value)
            {
                console.log(new_value, old_value); 
            }    
        },
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>
                <h6>Add new utility reading</h6>

                <div class="container-fluid">
                    <table class="table table-striped table-bordered table-hover">
                        <thead class="thead-light">
                            <tr class="text-center">
                                <th>Service</th>
                                <th>Apartment Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reading</th>
                                <th>Previous Reading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    you cann't edit me 
                                </td>
                                <td contenteditable>
                                    you should be able to edit me 
                                </td>
                            </tr>
                            <tr contenteditable>
                                <td>Edit me</td>
                                <td>Edit me</td>
                                <td>Edit me</td>
                                <td>Edit me</td>
                            </tr>
                            <tr contenteditable>
                                <td @input="TestInput">{{test_model}}</td>
                                <td @input="TestInput">{{test_model}}</td>
                                <td @input="TestInput">{{test_model}}</td>
                                <td @input="TestInput">{{test_model}}</td>
                            </tr>
                            <tr>
                                <td>
                                    <p contenteditable @input="TestInput">Change me </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    }    
); 