class ResolveOldLease_header extends PageWrapperChildrenComponent {
    render() {
        const {hopDong} = this.props;
        return (
            <div>
                <p>Ngày bắt đầu hợp đồng: {hopDong.Start_date}</p>
                <p>Ngày kết thúc hợp đồng: {hopDong.Finish}</p>
                <p>Trả đến khi: {hopDong.date_charged_until}</p>
            </div>
        )
    }
}

