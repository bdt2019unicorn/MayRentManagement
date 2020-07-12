Vue.component
(
    "date-compare-now", 
    {
        props: ["text"], 
        computed: 
        {
            DateStyle()
            {
                let date = new Date(this.text.trim()); 
                if(date instanceof Date && !isNaN(date))
                {
                    if(date>new Date())
                    {
                        return undefined; 
                    }
                }
                return {
                    color: "red"
                }; 
            }   
        },
        template: 
        `
            <p :style="DateStyle">
                {{text}}
            </p>
        `
    }
); 