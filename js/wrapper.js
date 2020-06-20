function CreateWrapper()
{
    window.wrapper = new Vue 
    (
        {
            el: "#page_wrapper", 
            components: 
            {
                vuejsDatepicker, VueAutonumeric
            }, 
            computed: 
            {
                ShowWrapper: function()
                {
                    return (window.store_track.state.controller!=''); 
                }, 
                Action: function()
                {
                    return window.store_track.state.action; 
                } 
            }
        }
    ); 
}
