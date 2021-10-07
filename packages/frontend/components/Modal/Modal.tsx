import * as React from "react";
import { Dialog } from "@headlessui/react";

export interface Modal {
  isOpen: boolean;
  children: React.ReactNode;
  close: () => void;
}

const Modal: React.FC<Modal> = ({ isOpen, close, children }) => {
  const refDiv = React.useRef(null);

  return (
    <Dialog initialFocus={refDiv} open={isOpen} onClose={close} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />
        <div ref={refDiv} className="bg-white z-10 w-full max-w-lg mx-auto py-12 px-8">
          <div className="flex flex-col space-y-4">{children}</div>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
