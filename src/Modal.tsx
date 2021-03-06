import * as React from "react";
import * as ReactDOM from "react-dom";
import { injectStyle } from "./injectStyle";

let counter = 0;
const instances: InstanceItem[] = [];

interface InstanceItem {
  key: string;
  instance: React.ReactNode;
  el: HTMLElement;
  option: Option;
}

interface Option {
  key?: string;
  fading?: boolean;
  style?: React.CSSProperties;
  onClose?: (...args: any[]) => void;
  clickOutsideToClose?: boolean;
}

class Instance extends React.Component {

  state: { children: React.ReactNode; option: Option; show: boolean; returnValue: any[] } = {
    children: null,
    option: {},
    show: true,
    returnValue: [],
  }

  show(children: React.ReactNode, option: Option) {
    this.setState({ children, option });
  }

  hide() {
    this.setState({ show: false });
  }

  handleClickOutside = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.option.clickOutsideToClose) {
      hide(this.state.option.key);
    }
  }

  render() {
    return <div className={`rfm-overlay ${this.state.option?.fading ? (this.state.show ? "show" : "hide") : ""}`}
      onClick={this.handleClickOutside}
      style={this.state.option?.style}>
      {this.state.children}
    </div>;
  }
}


const getInstance = (callback: any, _option?: Option) => {

  const option: Option = {
    key: String(counter++),
    onClose: () => { },
    fading: false,
    clickOutsideToClose: false,
    ..._option,
  };

  let i;
  const key = option.key as string;
  if (i = instances.find(x => x.key === key)) {
    callback(i.instance, option);
    return;
  }

  const el = document.createElement("div");
  document.body.appendChild(el);

  const ref = (instance: any) => {
    if (!instance) return;
    callback(instance, option);
    instances.push({ key, instance, el, option });
    return instance;
  };

  ReactDOM.render(<Instance ref={ref} />, el);
};

export const show = (children: React.ReactNode, option?: Option) => {
  injectStyle();
  getInstance((instance: any, o: Option) => {
    instance.show(children, o);
  }, option);
};

const hideAndRemove = (i: InstanceItem) => {
  const { el, option } = i;
  const instance = i.instance as any;
  if (option.fading) {
    instance.hide();
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(el);
      document.body.removeChild(el);
    }, 200);
  } else {
    ReactDOM.unmountComponentAtNode(el);
    document.body.removeChild(el);
  }
};

export const hide = (key?: string, ...args: any[]) => {
  let i;
  if (typeof key === "string") {
    if (i = instances.find(x => x.key === key)) {
      hideAndRemove(i);
      instances.splice(instances.indexOf(i), 1);
    }
  } else {
    if (i = instances.pop()) {
      hideAndRemove(i);
    }
  }
  if (i?.option.onClose) {
    // Call onClose callback
    i.option.onClose(...args);
  }
};
