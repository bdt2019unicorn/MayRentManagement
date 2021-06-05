class UtilityReadingListChoice extends PageWrapperChildrenComponent {
  render() {
    const { Select, MenuItem } = MaterialUI;
    const { mangCanHo, handleChoice } = this.props;

    const handleOnChange = (canHo) => {
      const { value } = canHo;
      let tenCH = "";
      const index = mangCanHo.findIndex((ch) => ch.id === value);
      if (index !== -1) {
        tenCH = mangCanHo[index].name;
      }
      handleChoice(value, tenCH);
    };

    return (
      <Select
        defaultValue=""
        native={false}
        onChange={(e) => handleOnChange(e.target)}
      >
        {mangCanHo.map((canHo, index) => {
          return (
            <MenuItem key={index} value={canHo.id}>
              {canHo.name}
            </MenuItem>
          );
        })}
      </Select>
    );
  }
}
