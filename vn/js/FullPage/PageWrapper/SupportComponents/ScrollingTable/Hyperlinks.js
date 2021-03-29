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
            if(!match.length)
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
                let last_splash = match[1].lastIndexOf("/"); 
                let path = match[1].substr(0, last_splash + 1) + match[1].charAt(last_splash+1).toUpperCase() + match[1].substr(last_splash+2);
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
        text = text[1]; 
        var Link = ReactRouterDOM.Link; 
        return (
            <Link to={to}>
                <Translate text={text} />
            </Link> 
        ); 
    }
}


class Hyperlink extends React.Component 
{
    render() 
    {
        var Link = ReactRouterDOM.Link; 
        return this.props.text; 
    }
}