class ResolveOldLease_rent extends PageWrapperChildrenComponent {
  render() {
    const {
      Table,
      Paper,
      TableContainer,
      TableHead,
      TableRow,
      TableBody,
      TableCell,
      TableFooter,
    } = MaterialUI;

    function createData(name, calories, fat, carbs, protein) {
      return { name, calories, fat, carbs, protein };
    }

    const rows = [
      createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    ];

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày bắt đầu hợp đồng</TableCell>
              <TableCell align="right">Trả đến khi</TableCell>
              <TableCell align="right">Kỳ hạn hợp đồng</TableCell>
              <TableCell align="right">Số tiền thuê</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Tổng tiền thanh toán</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
              <TableRow>
                <TableCell align="right">Tổng thành tiền: </TableCell>
              </TableRow>
         </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}
