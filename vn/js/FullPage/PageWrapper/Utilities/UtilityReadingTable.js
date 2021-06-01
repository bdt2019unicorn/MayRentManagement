class UtilityReadingTable extends PageWrapperChildrenComponent {
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

    const { DeleteIcon } = Icon;

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

    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dịch vụ</TableCell>
              <TableCell>Đơn vị tính</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Chỉ số ghi nhận</TableCell>
              <TableCell>Chỉ số trước</TableCell>
              <TableCell>Ngày ghi nhận chỉ số trước</TableCell>
              <TableCell>Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>ABC</TableCell>
              <TableCell>ABC</TableCell>
              <TableCell>
                <StyleText type="number" />
              </TableCell>
              <TableCell>
                <StyleText type="number" />
              </TableCell>
              <TableCell>
                <StyleText type="number" />
              </TableCell>
              <TableCell>ABC</TableCell>
              <TableCell>ABC</TableCell>
              <TableCell>
                <IconButton>
                  <Icon>delete</Icon>
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
