class UtilityReadingTable extends PageWrapperChildrenComponent {
  constructor(props){
    super(props);
    this.state = {
      ngayNhapLieu : new Date(),
    }
  }

  handleDate = (date) =>{
    this.setState({
      ngayNhapLieu: date,
    })
  }


  render() {
    const {
      Table,
      TableContainer,
      TableHead,
      TableRow,
      TableBody,
      TableCell,
      Paper,
      TextField,
      withStyles,
      Icon,
      IconButton,
    } = MaterialUI;

    const StyleText = withStyles({
      root: {
        "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
          {
            display: "none",
            margin: 80,
          },
        "&$disabled": {
          "&:before": {
            borderBottom: "none!important",
          },
          "& svg": {
            display: "none",
          },
        },
        underline: {
          "&:after": {
            transition: "none",
          },
        },
      },
    })(TextField);

    const { chonCanHo, danhSachTienIch, mangThongSoTienIch, tenCanHoChon } =
      this.props;

    const renameArray = mangThongSoTienIch.map((result) => ({
      id: result.revenue_type_id,
      number: result.number,
      prevDate: result.date,
    }));

    const mangTienIchDayDu = danhSachTienIch.map((item) => ({
      ...renameArray.find((chiTiet) => chiTiet.id === item.id),
      ...item,
    }));

    const {ngayNhapLieu} = this.state;

    const renderTable = () => {
      return (
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
              {mangTienIchDayDu.map((tienIch, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{tienIch.name}</TableCell>
                    <TableCell>{tenCanHoChon}</TableCell>
                    <TableCell>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          disableToolbar
                          variant="inline"
                          openTo="date"
                          format="DD/MM/yyyy"
                          value={ngayNhapLieu}
                          onChange={(date) => this.handleDate(date)}
                          autoOk={true}
                        />
                      </MuiPickersUtilsProvider>
                    </TableCell>
                    <TableCell>
                      <StyleText error type="time" />
                    </TableCell>
                    <TableCell>
                      <StyleText error type="number" />
                    </TableCell>
                    <TableCell>
                      {tienIch.number === undefined ? 0 : tienIch.number}
                    </TableCell>
                    <TableCell>
                      {tienIch.prevDate === undefined
                        ? ""
                        : moment(tienIch.prevDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <Icon>delete</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };

    return chonCanHo === "" ? "" : renderTable();
  }
}
