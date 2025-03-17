import React, { useEffect } from "react";
import { Alert, Button, Fade } from "react-bootstrap";
import { i18n } from "../js/i18n";
import "./PageTopAlert.css";

const ConnectionAlert = ({ onDismiss }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.keyCode === 13) {
        onDismiss();
      }
      // Kills everything because we don't want any further action performed under ConnectionAlert status
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", handler, true);

    return () => {
      window.removeEventListener("keydown", handler, true);
    };
  }, [onDismiss]);

  return (
    <Fade in>
      <Alert bsStyle="danger" className="PageTopAlert" onDismiss={onDismiss}>
        <h4>{i18n("alert_connectionHeader")}</h4>
        <p>{i18n("alert_connectionText")}</p>
        <p>
          <Button bsStyle="danger" onClick={onDismiss}>
            {i18n("alert_connectionReconnect")}
          </Button>
        </p>
      </Alert>
    </Fade>
  );
};

export default ConnectionAlert;
