Vue.component
(
    "hyperlink-list-compile", 
    {
        mixins: [scrolling_table_mixin], 
        render(create_element) 
        {
            let template = `<p>${this.row[this.column]}</p>`; 
            return create_element("p", [create_element(Vue.compile(template))]); 
        },
    }
); 

Vue.component
(
    "hyperlink", 
    {
        mixins: [scrolling_table_mixin], 
        computed: 
        {
            RouterLinkBind()
            {
                try
                {
                    let hyperlink_object = R.clone(this.special_column[this.column]); 
                    return {
                        to: this.ToActions
                        (
                            {
                                controller: hyperlink_object.controller, 
                                action: hyperlink_object.action,
                                query: 
                                {
                                    id: this.row[hyperlink_object["object_id"]]
                                }
                            }
                        ) 
                    }
                }
                catch 
                {
                    return {}; 
                }
            } 
        }, 
        template: `<router-link v-bind="RouterLinkBind">{{props.formattedRow[column]}}</router-link>`
    }
)