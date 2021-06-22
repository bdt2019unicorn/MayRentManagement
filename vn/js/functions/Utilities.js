class GeneralUtilities extends PageWrapperChildrenComponent 
{
	constructor(props) 
	{
		super(props);
		this.state = 
		{
			main_url: "../server/controller/utilities.php?command="
		};
	}
}

class Utilities extends GeneralUtilities 
{
	constructor(props) 
	{
		super(props);
		this.state = 
		{
			...this.state,
			select_data: 
			{
				utilities: [],
				units: [],
				select_value: "id",
				text: "name"
			},
			table_data: []
		};
		this.SelectData();
	}
	SelectData = () => 
	{
		this.state.select_data.units = this.TableData("unit", { edit: 1 });
		let utility_data = AjaxRequest(`${this.state.main_url}SelectData`);
		this.state.select_data.utilities = JSON.parse(utility_data);
	} 
}
