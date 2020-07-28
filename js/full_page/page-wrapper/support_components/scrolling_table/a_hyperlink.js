Vue.component
(
    "a-hyperlink", 
    {
        props: ["innitial_action", "params"], 
        computed: 
        {
            Href()
            {
                let href = this.innitial_action?`javascript: window.store_track.commit(${this.innitial_action}); ` :""; 
                try 
                {
                    Object.keys(this.params).forEach
                    (
                        param=>
                        {
                            href+=`javascript:window.store_track.commit('RedirectUrl', {param: '${param}',value:'${this.params[param]}'}); `; 
                        }
                    ); 
                }
                catch
                {
                    return `${href} javascript:window.store_track.commit('RedirectUrl', {}); `; 
                }
                return (href)?href: `javascript:window.store_track.commit('RedirectUrl', {}); `; 
            }, 
        },
        template: `<a :href="Href"><slot></slot></a>`
    }
); 

Vue.component
(
    "hyperlink-list-compile", 
    {
        props: ["list"], 
        render(create_element) 
        {
            let template = `<p>${this.list}</p>`; 
            return create_element("p", [create_element(Vue.compile(template))]); 
        },
    }
); 