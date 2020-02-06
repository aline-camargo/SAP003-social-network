const Google = (props) => {
  const template = `
    <input
      type=${props.type}
      class=${props.class}
      onclick="input.handleClick(${props.onClick})"
      src=${props.src}
    >`;

  return template;
};

window.input = {
  handleClick: (callBack) => {
    callBack();
  },
};

export default Google;
