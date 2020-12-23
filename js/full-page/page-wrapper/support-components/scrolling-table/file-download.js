Vue.component
(
    "file-link", 
    {
        props: ["file_extension", "name", "object_id", "url"], 
        mixins: [support_mixin], 
        data: ()=> ({file: undefined}),
        computed: 
        {
            DefaultName()
            {
                let start_position = this.name.length - this.file_extension.length; 
                return (this.name.substr(start_position)==this.file_extension && this.name[start_position-1]==".")? this.name: `${this.name}.${this.file_extension}`; 
            }
        }, 
        methods: 
        {
            DownloadFile()
            {
                if(!this.file)
                {
                    let blob = this.BlobRequest(this.url, {id: this.object_id}); 
                    if(blob.size)
                    {
                        this.file = blob; 
                    }
                }
                if(this.file)
                {
                    saveAs(this.file, this.DefaultName); 
                }
                else 
                {
                    alert("There seems to be an error with the server! Please try again"); 
                }
            }    
        },
        template: `<a href="javascript:void(0);" @click="DownloadFile"><slot>{{name}}</slot></a>`
    }
); 

Vue.component
(
    "file-download", 
    {
        mixins: [scrolling_table_mixin], 
        computed: 
        {
            FileLinkBind()
            {
                var special_column = R.clone(this.special_column[this.column]); 
                Object.keys(special_column).filter(key=>this.row[special_column[key]]).forEach(key=>special_column[key] = this.row[special_column[key]]); 
                return special_column; 
            }
        }, 
        template: `<file-link v-bind="FileLinkBind"></file-link>`
    }
); 