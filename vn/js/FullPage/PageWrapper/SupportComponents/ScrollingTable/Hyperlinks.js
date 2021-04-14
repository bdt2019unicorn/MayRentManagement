class BaseHyperlink extends React.Component
{
    render()
    {
        var Link = ReactRouterDOM.Link; 
        return (
            <Link to={this.props.to}>
                <Translate text={this.props.text} translate={this.props.translate} />
            </Link> 
        ); 
    }
}

class HyperlinkListCompile extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    Methods = 
    {
        ToObject()
        {
            let match = this.props.html.match('to="(.+)"'); 
            if(!_.get(match, "length"))
            {
                return undefined; 
            }
            try 
            {
                var object; 
                eval(`object = ${match[1]}`); 
                return ToActions(object); 
            }
            catch (exception)
            {
                let last_slash = match[1].lastIndexOf("/"); 
                let path = match[1].substr(0, last_slash + 1) + match[1].charAt(last_slash+1).toUpperCase() + match[1].substr(last_slash+2);
                return `/${(this.props.append || "")}/${path}`; 
            }
            
        }
    }
    render() 
    {
        if(!this.props.html)
        {
            return null; 
        }
        var to = this.ToObject(); 
        if(!to)
        {
            return null; 
        }
        var text = this.props.html.match('>(.+)<'); 
        if(!text.length)
        {
            return null; 
        }
        return <BaseHyperlink to={to} text={text[1]} translate={this.props.translate} />; 
    }
}

class Hyperlink extends React.Component 
{
    render() 
    {
        if(!this.props.html)
        {
            return null; 
        }
        let {action, controller, object_id} = this.props.special; 
        object_id = this.props.row[object_id]; 
        return <BaseHyperlink 
            to=
            {
                ToActions
                (
                    {
                        params: {building_id: this.props.append, action, controller}, 
                        query: {id: object_id}
                    }
                )
            }
            text={this.props.html}
            translate={this.props.translate}
        />; 
    }
}