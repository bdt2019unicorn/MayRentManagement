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

class Overview extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            table_data: this.TableData(this.CurrentController() || "overview"), 
            table_actions: this.TableActions(this.CurrentController() || "overview")
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
                <pre>
                    {component}
                </pre>
                <div>
                    <HyperlinkListCompile append={this.BuildingId()} html='<router-link to="leaseagrm/edit?id=144" append>Until March 31, 2021</router-link>`' />
                </div>
                <div>
                    <HyperlinkListCompile html={`<router-link :to="{name: 'actions', params: {controller: 'leaseagrm', action: 'edit', building_id: 6}, query: {id: 146} }">Until 30/07/2022</router-link>`} />
                </div>
                <div>
                    <ScrollingTable table={this.state.table_data} table_actions={this.state.table_actions} />
                </div>
            </div>         
        );
    }
}