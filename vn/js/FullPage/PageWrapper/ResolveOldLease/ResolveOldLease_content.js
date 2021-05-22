class ResolveOldLease_content extends PageWrapperChildrenComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      endDateCharge: "",
    };
  }

  // componentDidMount(){
  //   const { hopDong } = this.props;
  //   this.setState({
  //     endDateCharge: hopDong.date_charged_until,
  //   })
  // }

  // handleChangeDate = (date)=>{
  //   this.setState({
  //     endDateCharge: date,
  //   });
  // }

  render() {
    const { Collapse, Box, Grid, IconButton, Icon} = MaterialUI;

    const { hopDong, rentInvoice } = this.props;
    const { open } = this.state;

    return (
      <Box borderColor="primary.main" border={1} padding={2}>
        <Grid container justify="space-evenly" alignItems="center">
          <Grid item xs={1}>
            <MaterialUI.IconButton className="btn btn-danger">
              <MaterialUI.Icon fontSize="large">delete</MaterialUI.Icon>
            </MaterialUI.IconButton>
          </Grid>

          <Grid item xs={3}>
            <h2>{hopDong.name}</h2>
          </Grid>

          <Grid item xs={7}>
            {/* <ReactDatetime
              className="width-full mt-1"
              dateFormat="DD/MM/yyyy"
              inputProps={{ className: "width-full" }}
            /> */}
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                disableToolbar
                variant="inline"
                label="Only calendar"
                format="DD/MM/yyyy"
                value={hopDong.date_charged_until}
                onChange={this.props.DateChargedUntilChanged}
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              aria-label="expand row"
              size="small"
              className="float-right"
              onClick={() =>
                this.setState({
                  open: !open,
                })
              }
            >
              <Icon>{open ? "keyboard_arrow_up" : "keyboard_arrow_down"}</Icon>
            </IconButton>
          </Grid>
        </Grid>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className="m-3">
            <ResolveOldLease_header hopDong={hopDong} />
            <h3 align="center" className="m-3">
              Bảng giá Thuê
            </h3>
            <ResolveOldLease_rent hopDong={hopDong} className="m-3" rentInvoice={rentInvoice} />
            <h3 align="center" className="m-3">
              Chi phí sinh hoạt
            </h3>
            <ResolveOldLease_ultilities
              chiTietHD={hopDong.utilities}
              endDate = {hopDong.date_charged_until}
              className="m-3"
            />
          </Box>
        </Collapse>
      </Box>
    );
  }
}
