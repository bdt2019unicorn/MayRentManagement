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
    } = MaterialUI;
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
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    );
  }
}
