Vue.component
(
    "a-hyperlink", 
    {
        props: ["controller", "object_id", "text"], 
        methods: 
        {
            EditObject()
            {
                window.store_track.commit("RedirectUrl", {param: "controller", value: this.controller});
                window.store_track.commit("RedirectUrl", {param: "action", value: "edit"}); 
                window.store_track.commit("RedirectUrl", {param: "object_id", value: this.object_id}); 
            }
        },
        template: `<a href="javascript:void(0);" @click="EditObject">{{text}}</a>`
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