Vue.component
(
    "a-hyperlink", 
    {
        props: ["params"], 
        computed: 
        {
            Href()
            {
                let href = ""; 
                Object.keys(this.params).forEach
                (
                    param=>
                    {
                        href+=`javascript:window.store_track.commit('RedirectUrl', {param: '${param}',value:'${this.params[param]}'}); `; 
                    }
                ); 
                return (href)?href:undefined; 
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