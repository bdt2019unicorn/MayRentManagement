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
		const { Box, FormControl, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, withStyles } = MaterialUI;
  		const StyleText = withStyles
  		(
  			{
  				root: 
  				{
			  		"& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
			  		{
			  			display: "none",
			  			margin: 80
			  		},
			  		"&$disabled": 
			  		{
			  			"&:before": 
			  			{
			  				borderBottom: "none!important"
			  			},
			  			"& svg": 
			  			{
			  				display: "none"
			  			} 
  					},
			  		underline: 
			  		{
			  			"&:after": 
			  			{
			  				transition: "none"
			  			},
  					} 
  				} 
  			}
  		)(TextField);

		return (
			<Box>
				<Typography variant="h4" gutterBottom>Tiện Ích</Typography>
				<Typography variant="h6" gutterBottom>Thêm số liệu tiện ích</Typography>
				<FormControl variant="outlined" fullWidth={true} size="small" margin="normal">
					<div className="pr-3">
						<SelectInput 
							select_data={this.state.select_data.units}
							{...this.state.select_data}
							ValueChange={this.UnitIdValueChanged}
						/>
					</div>
					{
						Boolean(this.state.unit_id) && 
						(
							<TableContainer component={Paper}>
    							<Table aria-label="simple table">
    								<TableHead>
							    		<TableRow>
							    			<TableCell>Dịch vụ</TableCell>
										    <TableCell>Tên căn hộ</TableCell>
										    <TableCell>Ngày</TableCell>
										    <TableCell>Thời gian</TableCell>
										    <TableCell>Chỉ số ghi nhận</TableCell>
										    <TableCell>Chỉ số trước</TableCell>
										    <TableCell>Ngày ghi nhận chỉ số trước</TableCell>
										    <TableCell>Xóa</TableCell>
							    		</TableRow>
						    		</TableHead>
						    		<TableBody>
									    {
									    	this.state.utilities_readings.map
									    	(
									    		(utilities_reading, index) => 
									    		(
									        		<TableRow key={index}>
												        <TableCell>{utilities_reading.service}</TableCell>
												        <TableCell>{utilities_reading.unit_name}</TableCell>
									        			<TableCell><StyleText error type="text" defaultValue={DateReformat.Display()} /></TableCell>
									        			<TableCell><StyleText error type="text" defaultValue={DateReformat.TimeDisplay()} /></TableCell>
									        			<TableCell><StyleText error type="number" /></TableCell>
												        <TableCell>{utilities_reading.current_reading}</TableCell>
												        <TableCell>{DateReformat.Display(utilities_reading.current_date)}</TableCell>
											          <TableCell><IconButton><Icon>delete</Icon></IconButton></TableCell>
								          			</TableRow>
									          	) 
									      	)
									  	}
							      	</TableBody>
						      	</Table>
					      	</TableContainer>
						)
					}
				</FormControl>
				<SubmitButton type="button" />
			</Box>
		);
	}
}	
