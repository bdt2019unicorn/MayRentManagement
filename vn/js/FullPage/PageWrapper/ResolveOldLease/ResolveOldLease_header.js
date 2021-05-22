class ResolveOldLease_header extends PageWrapperChildrenComponent {
    render() {
        const {hopDong} = this.props;
        const { Typography } = MaterialUI;
        return (
            <div>
                <Typography variant="subtitle1" gutterBottom>Ngày bắt đầu hợp đồng: {moment(hopDong.Start_date).format("DD-MM-YYYY")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Ngày kết thúc hợp đồng: {moment(hopDong.Finish).format("DD-MM-YYYY")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Trả đến khi: {moment(hopDong.date_charged_until).format("DD-MM-YYYY")}</Typography>
            </div>
        )
    }
}

