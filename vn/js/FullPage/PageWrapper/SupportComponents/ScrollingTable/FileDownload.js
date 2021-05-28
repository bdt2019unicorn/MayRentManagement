class FileLink extends React.Component 
{
    constructor(props)
    {
        super(props); 
        this.state = {file: undefined}; 
    }
    DefaultName = () =>
    {
        var file_extension = this.props.file_extension.trim(); 
        var name = this.props.name.trim(); 
        let start_position = name.length - file_extension.length; 
        return (name.substr(start_position)==file_extension && name[start_position-1]==".")? name: `${name}.${file_extension}`; 
    } 
    DownLoadFile = () =>
    {
        var file; 
        if(!this.state.file)
        {
            let blob = BlobRequest(this.props.url, {id: this.props.object_id}); 
            if(blob.size)
            {
                file = blob; 
            }
        }
        file = file || this.state.file; 
        if(file)
        {
            new Promise 
            (
                (resolve, reject)=>
                {
                    saveAs(file, this.DefaultName()); 
                    resolve(); 
                }
            ).then 
            (
                ()=>
                {
                    if(!this.state.file)
                    {
                        this.setState({file}); 
                    }
                }
            ); 
        }
        else 
        {
            alert("Đã có lỗi hệ thống. Vui lòng thử lại sau."); 
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