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
		this.StyleText = MaterialUI.withStyles
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
		)(MaterialUI.TextField);
	}
	NewUtilityReadingValue = (name, index, value) => 
	{
		var utilities_readings = ImmutabilityHelper
		(
			this.state.utilities_readings, 
			{
				[index]:  
				{
					[name]: {$set: value}
				}
			}
		); 
		this.setState({utilities_readings}); 
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
	UtilitiesReadingValid()
	{
		if(!this.state.utilities_readings.length)
		{
			return false; 
		}
		let valid = this.state.utilities_readings.map(({date, ...rest})=>({date: DateReformat.ConvertFormatDisplay(date), ...rest})).filter
		(
			({date, time, number, current_reading, current_date }) => ValidObject
			(
				{
					date: moment(date).isValid(), 
					time: moment(time, DateReformat.Formats.TimeDisplay).isValid(), 
					number: (number!="") && (Number(number)>=Number(current_reading)), 
					current_date: current_date?moment(current_date)<moment(date): true 
				}
			)
		); 
		return valid.length==this.state.utilities_readings.length?                
		valid.map 
		(
			({ date, time, number, revenue_type_id, unit_id })=>
			(
				{
					date: `${DateReformat.Database(date)} ${DateReformat.ConvertTimeDisplay(time)}`,  
					number: Number(number), 
					revenue_type_id, 
					unit_id
				}
			) 
		): undefined; 
	}
	render() 
	{
		const { Box, FormControl, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } = MaterialUI;
		const StyleText = this.StyleText;
		var utilities_reading_valid = this.UtilitiesReadingValid(); 
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
									        			<TableCell>
															<StyleText 
																error 
																type="text" 
																value={utilities_reading.date} 
																onChange={(event)=>this.NewUtilityReadingValue("date", index, event.target.value)}
															/>
														</TableCell>
									        			<TableCell>
															<StyleText 
																error 
																type="text" 
																value={utilities_reading.time} 
																onChange={(event)=>this.NewUtilityReadingValue("time", index, event.target.value)}
															/>
														</TableCell>
									        			<TableCell>
															<StyleText 
																error 
																type="number" 
																value={utilities_reading.number}
																onChange={(event)=>this.NewUtilityReadingValue("number", index, event.target.value)}
															/>
														</TableCell>
												        <TableCell>{utilities_reading.current_reading}</TableCell>
												        <TableCell>{DateReformat.Display(utilities_reading.current_date)}</TableCell>
											          	<TableCell>
															<IconButton 
																onClick=
																{
																	() => 
																	{
																		var utilities_readings = ImmutabilityHelper
																		(
																			this.state.utilities_readings, 
																			{
																				$splice: [[index, 1]]
																			}
																		); 
																		this.setState({utilities_readings}); 
																	}
																}
															>
																  <Icon>delete</Icon>
															</IconButton>
														</TableCell>
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
				{ 
					utilities_reading_valid && 
					<SubmitButton 
						type="button" 
						SubmitButtonClick=
						{
							() =>
							{
								let result = SubmitData("excel", this.ImportUrl(),utilities_reading_valid); 
								if(Number(result))
								{
									alert("Add Reading Success"); 
									this.UnitIdValueChanged({value: this.state.unit_id}); 
								}
								else 
								{
									alert("There seems like an issue with the server, please try again"); 
								}
							}
						}
					/> 
				}
			</Box>
		);
	}
}	
