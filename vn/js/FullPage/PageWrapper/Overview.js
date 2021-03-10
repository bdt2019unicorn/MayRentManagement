class Test extends React.Component
{
    render() {
        return (
            <div style={this.props.style}>
                I am testing {this.props.message}
                {this.props.children}
            </div>
        ); 
    }
}

class TestWord extends React.Component
{
    render() {
        return "word"; 
    }
}

class Overview extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            table_data: this.TableData(this.CurrentController() || "overview")
        }; 
    }
    render() 
    {

        var component = null; 
        try {
            console.log(JSXTransformer); 
            component = "<Test style={{color: 'red', fontSize: 'large'}} message='this things'>test babel</Test>"; 
            component = JSXTransformer.transform(component); 
            console.log(component); 
            component = eval(component.code); 
        }
        catch(exception){console.log(exception); }
        
        return (
            <div>
                Overview
                <p><TestWord /></p>
                <pre>
                    {component}
                </pre>
                <div>
                    <ScrollingTable table={this.state.table_data} />
                </div>
            </div>         
        );
    }
}