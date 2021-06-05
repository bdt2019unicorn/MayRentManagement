class UtilityReading extends Utilities {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      mangCanHo: this.state.select_data.units,
      chonCanHo: "",
      danhSachTienIch: this.state.select_data.utilities,
      tenCanHoChon: "",
      mangThongSoTienIch: [],
    };
  }

  handleChoice = (id, tenCanHo) => {
    let current_readings = ServerJson(
      `${this.state.main_url}CurrentReadings&unit_id=${id}`
    );
    this.setState({
      chonCanHo: id,
      mangThongSoTienIch: current_readings,
      tenCanHoChon: tenCanHo,
    });
  };

  render() {
    const { Box, Typography, FormControl } = MaterialUI;
    const { mangCanHo, chonCanHo, danhSachTienIch, mangThongSoTienIch, tenCanHoChon } = this.state;
  
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Tiện Ích
        </Typography>
        <Typography variant="h6" gutterBottom>
          Thêm mới tiện ích
        </Typography>
        <FormControl
          variant="outlined"
          fullWidth={true}
          size="small"
          margin="normal"
        >
          <UtilityReadingListChoice
            mangCanHo={mangCanHo}
            handleChoice={this.handleChoice}
          />
        </FormControl>
        <UtilityReadingTable
          chonCanHo={chonCanHo}
          danhSachTienIch={danhSachTienIch}
          mangThongSoTienIch={mangThongSoTienIch}
          tenCanHoChon ={tenCanHoChon}
        />
        <SubmitButton type="button" />
      </Box>
    );
  }
}
