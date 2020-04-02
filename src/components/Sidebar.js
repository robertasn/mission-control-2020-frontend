import React from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport,
  faSave,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

const TOOLTIP_DELAY = 300;
const TOOLTIP_TEXT_COLOR = "#8f8f8f";

const Input = () => <input id="fileButton" type="file" hidden />;

const Button = props => (
  <div
    className="sidebar__icon"
    onClick={props.onClick}
    data-tip={props.tooltip}
  >
    {props.input ? <Input></Input> : <div />}
    <ReactTooltip
      effect="solid"
      delayShow={TOOLTIP_DELAY}
      textColor={TOOLTIP_TEXT_COLOR}
      place="left"
    />
    <FontAwesomeIcon icon={props.icon} />
  </div>
);

const Sidebar = props => {
  return (
    <div id="sidebar">
      <Button
        onClick={props.handleAddGraphClick}
        tooltip="Add graph"
        input={false}
        icon={faPlus}
      ></Button>
      <Button
        onClick={props.handleUploadClick}
        tooltip="Upload config"
        input={true}
        icon={faFileImport}
      ></Button>
      <Button
        onClick={props.handleSaveClick}
        tooltip="Save config"
        input={false}
        icon={faSave}
      ></Button>
    </div>
  );
};

export default Sidebar;