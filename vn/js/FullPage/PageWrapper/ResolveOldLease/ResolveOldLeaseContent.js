class ResolveOldLeaseContent extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      status: true
    };
  }

  handleDeleteChoice = (id) => {
    const { handleDelete } = this.props;
    handleDelete(id);
  };

  componentDidUpdate(prevProps, prevState){
    const { hopDong, handleCheckDate } = this.props;
    if (prevState.status !== this.state.status) {
      let check = true;
      if (moment(hopDong.date_charged_until).isSameOrBefore(hopDong.Start_date)) {
        check = false;
      }
      handleCheckDate(check);
    }
  }


  render() {
    const { Collapse, Box, Grid, IconButton, Icon } = MaterialUI;

    const { hopDong, rentInvoice, DateChargedUntilChanged } = this.props;
    const { open } = this.state;

    const colorChange = ()=>{
      if(hopDong.isHDValid){
        return "primary.main";
      }
      return "secondary.main";
    }

    return (
      <Box borderColor={colorChange()} border={3} padding={2} m={5}>
        <Grid container justify="space-around" alignItems="center" spacing={1}>
          <Grid item xs={2} lg={2}>
            <MaterialUI.IconButton
              onClick={() => this.handleDeleteChoice(hopDong.id)}
              className="btn btn-danger"
            >
              <MaterialUI.Icon fontSize="large">delete</MaterialUI.Icon>
            </MaterialUI.IconButton>
          </Grid>

          <Grid item xs={5} lg={4}>
            <h2>{hopDong.name}</h2>
          </Grid>

          <Grid item xs={4} lg={5}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                disableToolbar
                variant="inline"
                openTo="date"
                format="DD/MM/yyyy"
                value={hopDong.date_charged_until}
                onChange={(date)=>{DateChargedUntilChanged(date); this.setState({
                  status: !this.state.status,
                })}}
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={1} lg={1}>
            <IconButton
              aria-label="expand row"
              size="small"
              className="float-right"
              onClick={() => this.setState({open: !open,})}
            >
              <Icon>{open ? "keyboard_arrow_up" : "keyboard_arrow_down"}</Icon>
            </IconButton>
          </Grid>
        </Grid>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className="m-3">
            <ResolveOldLeaseHeader
              hopDong={hopDong}
            />
            <h3 align="center" className="m-3">
              Bảng giá Thuê
            </h3>
            <ResolveOldLeaseRent
              hopDong={hopDong}
              className="m-3"
              rentInvoice={rentInvoice}
            />
            <h3 align="center" className="m-3">
              Chi phí sinh hoạt
            </h3>
            <ResolveOldLeaseUltilities
              chiTietHD={hopDong.utilities}
              endDate={hopDong.date_charged_until}
              className="m-3"
            />
          </Box>
        </Collapse>
      </Box>
    );
  }
}
