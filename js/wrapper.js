function CreateWrapper()
{
    window.wrapper = new Vue 
    (
        {
            el: "#page_wrapper", 
            data: 
            {
                show_me: false
            },
            computed: 
            {
                ShowWrapper: function()
                {
                    if(window.store_track.state.controller!="")
                    {
                        return ""; 
                    }
                    else 
                    {
                        return "display: none;"; 
                    }
                }    
            }
        }
    ); 
}