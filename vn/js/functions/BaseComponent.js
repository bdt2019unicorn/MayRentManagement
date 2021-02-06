class BaseComponent extends React.Component 
{
    constructor(props)
    {
        super(props); 
        this.state = {}; 
    }
    static getDerivedStateFromProps(next_props, previous_state)
    {
        return null; 
    }
    componentDidMount() 
    {
        if(this.CustomEvents)
        {
            Object.keys(this.CustomEvents).forEach(event=>Emitter.on(event, this.CustomEvents[event])); 
        }
    }
    componentWillUnmount() 
    {
        if(this.CustomEvents)
        {
            Object.keys(this.CustomEvents).forEach(event=>Emitter.off(event)); 
        }
    }
}