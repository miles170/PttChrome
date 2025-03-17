import cx from "classnames";
import React, { useCallback } from "react";
import {
  Modal,
  OverlayTrigger,
  Tooltip,
  Button,
  CloseButton,
} from "react-bootstrap";
import { i18n } from "../../js/i18n";
import "./LiveHelperModal.css";

const normalizeSec = (value) => {
  const sec = parseInt(value, 10);
  return sec > 1 ? sec : 1;
};

const LiveHelperModal = ({ show, onHide, enabled, sec, onChange }) => {
  const onEnabledClick = useCallback(() => {
    onChange({ enabled: !enabled, sec });
  }, [enabled, sec, onChange]);

  const onSecChange = useCallback(
    ({ target: { value } }) => {
      onChange({ enabled, sec: normalizeSec(value) });
    },
    [enabled, onChange],
  );

  return (
    <Modal show={show} backdrop={false}>
      <Modal.Body className="LiveHelperModal__Body">
        <OverlayTrigger placement="top" overlay={<Tooltip>Alt + r</Tooltip>}>
          <Button active={enabled} onClick={onEnabledClick}>
            {i18n("liveHelperEnable")}
          </Button>
        </OverlayTrigger>
        <span className="LiveHelperModal__Body__Text nomouse_command">
          {i18n("liveHelperSpan")}
        </span>
        <input
          type="number"
          className="LiveHelperModal__Body__Input form-control nomouse_command"
          value={sec}
          onChange={onSecChange}
        />
        <span className="LiveHelperModal__Body__Text nomouse_command">
          {i18n("liveHelperSpanSec")}
        </span>
        <CloseButton
          className="LiveHelperModal__Body__Close nomouse_command"
          onClick={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default LiveHelperModal;
