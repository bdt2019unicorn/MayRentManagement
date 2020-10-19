function BindFucntions(component)
{
    console.log(component.SupportFunction);
    let support_functions = new component.SupportFunction(); 
    console.log(support_functions);  
    Object.keys(support_functions).forEach(func=>component[func] = support_functions[func].bind(component)); 
}


class ImportExcel extends React.Component
{
    constructor(props)
    {
        super(props); 
        this.ReadExcelFile = this.ReadExcelFile.bind(this); 
        /*
        console.log(this.SupportFunction);
        let support_functions = new this.SupportFunction(); 
        console.log(support_functions);  
        Object.keys(support_functions).forEach(func=>this[func] = support_functions[func].bind(this)); 
        */
        // let functions =Object.keys(support_functions); 
        // for (let index = 0; index < functions.length; index++) 
        // {
        //     const func = functions[index];
        //     this[func] = support_functions[func].bind(this);             
        // }
        BindFucntions(this); 
    }

    async ReadExcelFile(event)
    {
        var input = event.currentTarget; 
        console.log(event.currentTarget);
        console.log(input.files); 
        var file = input.files[0]; 

        // var workbook = new Excel.Workbook(); 
        // await workbook.xlsx.read(file); 

        // console.log(workbook); 

        var buffer = await file.arrayBuffer();
        var workbook = XLSX.read
        (
            buffer,
            {
                type: "array"
            }
        );
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var json_data = XLSX.utils.sheet_to_json
        (
            worksheet,
            {
                raw:false
            }
        );

        console.log(json_data); 

    }

    SupportFunction()
    {
        this.Test = function()
        {
            console.log("test"); 
        }; 
    }

    render()
    {
        return (
            <React.Fragment>
                <input type="file" onChange={this.ReadExcelFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
                <button onClick={this.Test}>Test</button>
            </React.Fragment>
        ); 
    }
}



class FullPage extends React.Component 
{
    constructor(props)
    {
        super(props); 
        var url = "../server/overview_controller/overview_controller.php?overview_controller=buildings"; 
        let buildings = support_mixin.methods.AjaxRequest(url); 
        this.state = 
        {
            value: "try me in state", 
            buildings: JSON.parse(buildings), 
        }
    }



    render()
    {
        let buildings = this.state.buildings.map(building=><p key={building.id}>{JSON.stringify(building)}</p>); 
        return (
            <React.Fragment>
                <ImportExcel />
                {buildings}
            </React.Fragment>
        ); 
    }
}