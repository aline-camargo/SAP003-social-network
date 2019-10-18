const Button = (props) => {
  const template = `
    <button type= ${props.type} class="${props.class}" disabled="${props.disabled}" onclick="button.handleClick(event,${props.onClick})">
    ${props.title}</button>`;
  return template;
};

window.button = {
  handleClick: (event, callBack) => {
    event.preventDefault();
    callBack();
  },
};

export default Button;
