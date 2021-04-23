class FileLink extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {file: undefined}; 
    }
    Methods = 
    {
        DefaultName()
        {
            var file_extension = this.props.file_extension.trim(); 
            var name = this.props.name.trim(); 
            let start_position = name.length - file_extension.length; 
            return (name.substr(start_position)==file_extension && name[start_position-1]==".")? name: `${name}.${file_extension}`; 
        }, 
        DownLoadFile()
        {
            if(!this.state.file)
            {
                let blob = BlobRequest(this.props.url, {id: this.props.object_id}); 
                console.log(blob); 
                if(blob.size)
                {
                    this.setState({file: blob}); 
                }
            }
            if(this.state.file)
            {
                saveAs(this.state.file, this.DefaultName()); 
            }
            else 
            {
                alert("There seems to be an error with the server! Please try again"); 
            }
        }
    }
    render() 
    {
        return <a className="file-upload-download-label" onClick={this.DownLoadFile}>{this.props.children || this.props.name}</a> ; 
    }
}

class FileDownload extends React.Component 
{
    render() 
    {
        var file_link_bind = {}; 
        for (const props in this.props.special) 
        {
            var special_props = this.props.special[props]; 
            file_link_bind[props] = props=="url"? special_props: this.props.row[special_props]; 
        }
        return <FileLink {...file_link_bind} /> ; 
    }
}