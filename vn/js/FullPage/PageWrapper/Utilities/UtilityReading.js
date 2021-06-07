class UtilityReading extends Utilities 
{
	constructor(props) 
	{
		super(props);
		this.state = 
		{
			...this.state,
			unit_id: "", 
			utilities_readings: []
	      // mangCanHo: this.state.select_data.units,
	      // chonCanHo: "",
	      // danhSachTienIch: this.state.select_data.utilities,
	      // tenCanHoChon: "",
	      // mangThongSoTienIch: [],
		};
	}

	UnitIdValueChanged = ({value}) => this.ResetStateValue
	(
		{
			value_name: "unit_id", 
			new_value: value, 
			undefined_value: "", 
			callback_resolve: ()=>
			{
				try 
				{
					let current_readings = ServerJson(`${this.state.main_url}CurrentReadings&unit_id=${value}`);
					var CurrentReading = function(revenue_type_id, look_up)
					{
						try 
						{
							return current_readings.find(reading=>reading.revenue_type_id==revenue_type_id)[look_up]; 
						}
						catch (exception)
						{
							return 0; 
						}
					};
					this.setState
					(
						{
							utilities_readings: this.state.select_data.utilities.map
							(
								revenue_type =>
								(
									{
										revenue_type_id: revenue_type.id, 
										unit_id: value, 
										service: revenue_type.name, 
										unit_name: this.state.select_data.units.find(unit=>unit.id==value).name, 
										date: DateReformat.Display(), 
										time: DateReformat.TimeDisplay(), 
										number: "", 
										current_reading: CurrentReading(revenue_type.id, "number"), 
										current_date: CurrentReading(revenue_type.id, "date")
									}
								)
							) 
						}
					); 
				} 
				catch (exception)
				{
					this.setState({utilities_readings: []}); 
				}
			}
		}
	) 

	render() 
	{
		const { Box, FormControl, Typography } = MaterialUI;
		const { mangCanHo, chonCanHo, danhSachTienIch, mangThongSoTienIch, tenCanHoChon } = this.state;

		return (
			<Box>
				<Typography variant="h4" gutterBottom>Tiện Ích</Typography>
				<Typography variant="h6" gutterBottom>Thêm mới tiện ích</Typography>
				<FormControl variant="outlined" fullWidth={true} size="small" margin="normal">
					<div className="pr-3">
						<SelectInput 
							select_data={this.state.select_data.units}
							{...this.state.select_data}
							ValueChange={this.UnitIdValueChanged}
						/>
					</div>
					{/*
						<UtilityReadingListChoice
						mangCanHo={mangCanHo}
						handleChoice={this.handleChoice}
						/>

						<UtilityReadingTable
						chonCanHo={chonCanHo}
						danhSachTienIch={danhSachTienIch}
						mangThongSoTienIch={mangThongSoTienIch}
						tenCanHoChon={tenCanHoChon}
						/>
					*/}
				</FormControl>
				<SubmitButton type="button" />
			</Box>
		);
	}
}	
