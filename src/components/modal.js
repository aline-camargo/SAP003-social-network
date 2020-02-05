import Button from './button.js';

// const confirm = () => {
//   console.log('confirmou');
// };

const close = () => {
  document.querySelector('#check-delete').classList.add('hide');
};

const Modal = ({ confirm }) => `
    <div id="check-delete" aria-hidden="true" class="modal-overlay hide">
        <div tabindex="-1" class="modal-container">
        <div role="dialog" aria-modal="true" aria-labelledby="modal-1-title" >
            <header>
            <h2 class="modal-title">
                Deseja mesmo deletar?
            </h2>
            ${Button({
    type: 'button',
    title: 'Cancelar',
    class: 'primary-button error',
    onClick: close,
  })}
            ${Button({
    type: 'button',
    title: 'Confirmar',
    class: 'primary-button success confirm-delete',
    onClick: confirm,
  })}
            </header>
        </div>
        </div>
    </div>
  `;

window.button = {
  handleClick: (event, callBack) => {
    callBack(event);
  },
};

export default Modal;
