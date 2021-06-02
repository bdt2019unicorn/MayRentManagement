class ResolveOldLeaseUltilities extends React.Component  
{
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
      Typography,
    } = MaterialUI;

    const { chiTietHD, endDate } = this.props;
    const tienIch = { ...chiTietHD };

    let chiTietTienIch = Object.values(tienIch).flatMap((item) =>
      Object.values(item)
    );

    const softDate = chiTietTienIch.filter(({ date }) => moment(date).isBefore(moment(endDate)));

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phí sinh hoạt</TableCell>
              <TableCell align="right">Ngày bắt đầu</TableCell>
              <TableCell align="right">Ngày kết thúc</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {
                softDate.map
                (
                  (item, index) =>
                  (
                    <TableRow key={index}>
                      <TableCell align="left">{item.revenue_type}</TableCell>
                      <TableCell align="right">
                        {DateReformat.Display(item.previous_date)}
                      </TableCell>
                      <TableCell align="right">
                        {DateReformat.Display(item.date)}
                      </TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {(item.quantity * item.price).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )
                )
              }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="right" colSpan={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Tổng thành tiền:{" "}
                  {softDate.reduce((tongTien, item)=> tongTien += item.quantity * item.price, 0).toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}
