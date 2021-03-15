Vue.component
(
    "basic-calculations-units", 
    {
        mixins: [support_mixin], 
        // data: () =>
        // (
        //     {
        //         add_building_form: undefined, 
        //         display: {}
        //     }
        // ),
        components: {...bootstrap, ...vueFragment}, 
        methods: 
        {
        },
        created() 
        {
        },

        template: 
        `
            <fragment>
                <div class="basic-calculations-unit-div">
                    <div class="card__add">
                        <input type="text">
                        <button value="update">
                            <i class="fas fa-check-double"></i>
                        </button>
                    </div>
                </div>
            </fragment>
        `
    }
); 