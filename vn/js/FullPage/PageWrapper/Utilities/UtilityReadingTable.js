class UtilityReadingTable extends PageWrapperChildrenComponent {
  constructor(props) {
    super(props);
    this.state = {
      ngayNhapLieu: new Date(),
    };
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

    const initalDate = {
      date: moment().format("DD-MM-YYYY"),
      time: moment().format("HH:mm"),
    };

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
                       <StyleText error
                        type="text"
                        defaultValue={initalDate.date}  />
                    </TableCell>
                    <TableCell>
                      <StyleText
                        error
                        type="text"
                        defaultValue={initalDate.time}
                      />
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
