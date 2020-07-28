Vue.component
(
    "utility-reading", 
    {
        mixins: [utilities_mixin], 
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
                            
                        </tbody>
                    </table>
                <div>
            </div>
        `
    }    
); 