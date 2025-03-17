import cx from "classnames";
import React, { useState, useCallback } from "react";
import {
  Modal,
  Tab,
  Nav,
  Button,
  FormGroup,
  FormControl,
  OverlayTrigger,
  Popover,
  Form,
  CloseButton,
} from "react-bootstrap";
import { i18n } from "../../js/i18n";
import "./PrefModal.css";

const DEFAULT_PREFS = {
  // general
  enablePicPreview: true,
  enableNotifications: true,
  enableEasyReading: false,
  endTurnsOnLiveUpdate: false,
  copyOnSelect: false,
  antiIdleTime: 0,
  lineWrap: 78,

  // mouse browsing
  useMouseBrowsing: false,
  mouseBrowsingHighlight: true,
  mouseBrowsingHighlightColor: 2,
  mouseLeftFunction: 0,
  mouseMiddleFunction: 0,
  mouseWheelFunction1: 1,
  mouseWheelFunction2: 2,
  mouseWheelFunction3: 3,

  // displays
  fontFitWindowWidth: false,
  fontFace: "MingLiu,SymMingLiu,monospace",
  fontSize: 20,
  termSize: { cols: 80, rows: 24 },
  termSizeMode: "fixed-term-size",
  bbsMargin: 0,
};

const PREF_STORAGE_KEY = "pttchrome.pref.v1";

export const readValuesWithDefault = () => {
  try {
    return {
      ...DEFAULT_PREFS,
      ...JSON.parse(window.localStorage.getItem(PREF_STORAGE_KEY)).values,
    };
  } catch (e) {
    return {
      ...DEFAULT_PREFS,
    };
  }
};

const writeValues = (values) => {
  try {
    window.localStorage.setItem(
      PREF_STORAGE_KEY,
      JSON.stringify({
        values,
      }),
    );
  } catch (e) {}
  return values;
};

const replaceI18n = (id, replacements) => {
  return i18n(id)
    .split(/#(\S+)#/gi)
    .map((it, index) => {
      if (index % 2 === 1 && it in replacements) {
        return replacements[it];
      } else {
        return it;
      }
    });
};

const link = (text, url) => (
  <a href={url} target="_blank" rel="noreferrer">
    {text}
  </a>
);

const changeNestedValue = (obj, key, newValue) => {
  let i = key.indexOf(".");
  if (i > 0) {
    let parentKey = key.substring(0, i);
    let subKey = key.substring(i + 1);
    return {
      ...obj,
      [parentKey]: changeNestedValue(obj[parentKey], subKey, newValue),
    };
  }
  return {
    ...obj,
    [key]: newValue,
  };
};

const PrefModal = ({ show, onSave, onReset }) => {
  const [navActiveKey, setNavActiveKey] = useState("general");
  const [values, setValues] = useState(readValuesWithDefault());
  const [replacements] = useState({
    link_github_iamchucky: link("Chuck Yang", "https://github.com/iamchucky"),
    link_github_robertabcd: link("robertabcd", "https://github.com/robertabcd"),
    link_robertabcd_PttChrome: link(
      "robertabcd/PttChrome",
      "https://github.com/robertabcd/PttChrome",
    ),
    link_iamchucky_PttChrome: link(
      "iamchucky/PttChrome",
      "https://github.com/iamchucky/PttChrome",
    ),
    link_GPL20: link(
      "General Public License v2.0",
      "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html",
    ),
  });

  const onCloseClick = useCallback(() => {
    onSave(writeValues(values));
  }, [onSave, values]);

  const onResetClick = useCallback(() => {
    onReset(
      writeValues({
        ...DEFAULT_PREFS,
      }),
    );
  }, [onReset]);

  const onNavSelect = useCallback((activeKey) => {
    setNavActiveKey(activeKey);
  }, []);

  const onCheckboxChange = useCallback(({ target: { name, checked } }) => {
    setValues((values) => changeNestedValue(values, name, !!checked));
  }, []);

  const onNumberInputChange = useCallback(({ target: { name, value } }) => {
    setValues((values) => changeNestedValue(values, name, parseInt(value, 10)));
  }, []);

  const onTextInputChange = useCallback(({ target: { name, value } }) => {
    setValues((values) => changeNestedValue(values, name, value));
  }, []);

  return (
    <Modal show={show} onHide={onCloseClick} className="PrefModal">
      <Modal.Body>
        <Tab.Container activeKey={navActiveKey} onSelect={onNavSelect}>
          <div className="PrefModal__Grid">
            <div className="PrefModal__Grid__Col--left">
              <h3>{i18n("menu_settings")}</h3>
              <Nav bsStyle="pills" stacked>
                <Nav.Item>
                  <Nav.Link eventKey="general">
                    {i18n("options_general")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="about">{i18n("options_about")}</Nav.Link>
                </Nav.Item>
              </Nav>
              <Button
                className="PrefModal__Grid__Col--left__Reset"
                onClick={onResetClick}
              >
                {i18n("options_reset")}
              </Button>
            </div>
            <div className="PrefModal__Grid__Col--right">
              <Tab.Content animation>
                <Tab.Pane eventKey="general">
                  <fieldset className="PrefModal__Grid__Col--right__Fieldset">
                    <legend>
                      {i18n("options_general")}
                      <CloseButton onClick={onCloseClick} />
                    </legend>
                    <Form.Check
                      type="checkbox"
                      name="enablePicPreview"
                      label={i18n("options_enablePicPreview")}
                      checked={values.enablePicPreview}
                      onChange={onCheckboxChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="enableNotifications"
                      label={i18n("options_enableNotifications")}
                      checked={values.enableNotifications}
                      onChange={onCheckboxChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="enableEasyReading"
                      label={i18n("options_enableEasyReading")}
                      checked={values.enableEasyReading}
                      onChange={onCheckboxChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="endTurnsOnLiveUpdate"
                      label={i18n("options_endTurnsOnLiveUpdate")}
                      checked={values.endTurnsOnLiveUpdate}
                      onChange={onCheckboxChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="copyOnSelect"
                      label={i18n("options_copyOnSelect")}
                      checked={values.copyOnSelect}
                      onChange={onCheckboxChange}
                    />
                    <FormGroup controlId="antiIdleTime">
                      <Form.Label>{i18n("options_antiIdleTime")}</Form.Label>
                      <OverlayTrigger
                        trigger="focus"
                        placement="right"
                        overlay={
                          <Popover id="tooltip_antiIdleTime">
                            {i18n("tooltip_antiIdleTime")}
                          </Popover>
                        }
                      >
                        <FormControl
                          name="antiIdleTime"
                          type="number"
                          value={values.antiIdleTime}
                          onChange={onNumberInputChange}
                        />
                      </OverlayTrigger>
                    </FormGroup>
                    <FormGroup controlId="lineWrap">
                      <Form.Label>{i18n("options_lineWrap")}</Form.Label>
                      <FormControl
                        name="lineWrap"
                        type="number"
                        value={values.lineWrap}
                        onChange={onNumberInputChange}
                      />
                    </FormGroup>
                  </fieldset>
                  <fieldset className="PrefModal__Grid__Col--right__Fieldset">
                    <legend>{i18n("options_appearance")}</legend>
                    <FormGroup controlId="fontFace">
                      <Form.Label>{i18n("options_fontFace")}</Form.Label>
                      <OverlayTrigger
                        trigger="focus"
                        placement="right"
                        overlay={
                          <Popover id="tooltip_fontFace">
                            {i18n("tooltip_fontFace")}
                          </Popover>
                        }
                      >
                        <FormControl
                          name="fontFace"
                          type="text"
                          value={values.fontFace}
                          onChange={onTextInputChange}
                        />
                      </OverlayTrigger>
                    </FormGroup>
                    <FormGroup controlId="bbsMargin">
                      <Form.Label>{i18n("options_bbsMargin")}</Form.Label>
                      <FormControl
                        name="bbsMargin"
                        type="number"
                        value={values.bbsMargin}
                        onChange={onNumberInputChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="termSizeMode">
                      <Form.Label>{i18n("options_termSize")}</Form.Label>
                      <Form.Select
                        name="termSizeMode"
                        value={values.termSizeMode}
                        onChange={onTextInputChange}
                      >
                        <option
                          key={"options_fixedTermSize"}
                          value={"fixed-term-size"}
                        >
                          {i18n("options_fixedTermSize")}
                        </option>
                        <option
                          key={"options_fixedFontSize"}
                          value={"fixed-font-size"}
                        >
                          {i18n("options_fixedFontSize")}
                        </option>
                      </Form.Select>
                    </FormGroup>
                    {(() => {
                      switch (values.termSizeMode) {
                        case "fixed-term-size":
                          return (
                            <div>
                              <FormGroup controlId="termSize_cols">
                                <Form.Label>{i18n("options_cols")}</Form.Label>
                                <FormControl
                                  name="termSize.cols"
                                  type="number"
                                  value={values.termSize.cols}
                                  onChange={onNumberInputChange}
                                />
                              </FormGroup>
                              <FormGroup controlId="termSize_rows">
                                <Form.Label>{i18n("options_rows")}</Form.Label>
                                <FormControl
                                  name="termSize.rows"
                                  type="number"
                                  value={values.termSize.rows}
                                  onChange={onNumberInputChange}
                                />
                              </FormGroup>
                              <Form.Check
                                type="checkbox"
                                name="fontFitWindowWidth"
                                label={i18n("options_fontFitWindowWidth")}
                                checked={values.fontFitWindowWidth}
                                onChange={onCheckboxChange}
                              />
                            </div>
                          );
                        case "fixed-font-size":
                          return (
                            <FormGroup controlId="fontSize">
                              <Form.Label>
                                {i18n("options_fontSize")}
                              </Form.Label>
                              <FormControl
                                name="fontSize"
                                type="number"
                                value={values.fontSize}
                                onChange={onNumberInputChange}
                              />
                            </FormGroup>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </fieldset>
                  <fieldset className="PrefModal__Grid__Col--right__Fieldset">
                    <legend>{i18n("options_mouseBrowsing")}</legend>
                    <Form.Check
                      type="checkbox"
                      name="useMouseBrowsing"
                      label={i18n("options_useMouseBrowsing")}
                      checked={values.useMouseBrowsing}
                      onChange={onCheckboxChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="mouseBrowsingHighlight"
                      label={i18n("options_mouseBrowsingHighlight")}
                      checked={values.mouseBrowsingHighlight}
                      onChange={onCheckboxChange}
                    />
                    <div className="PrefModal__Grid__Col--right__MouseBrowsingHighlightColor">
                      {i18n("options_highlightColor")}
                      <Form.Select
                        className={cx(
                          `b${values.mouseBrowsingHighlightColor}`,
                          `b${values.mouseBrowsingHighlightColor}`,
                        )}
                        name="mouseBrowsingHighlightColor"
                        value={values.mouseBrowsingHighlightColor}
                        onChange={onNumberInputChange}
                      >
                        {Array(16)
                          .fill(0, 1 /* skip transparent (index === 0) */)
                          .map((x, i) => (
                            <option
                              key={i}
                              value={i}
                              className={cx(
                                `b${i}` /* FIXME: Existing bug: Not working for Chrome */,
                              )}
                            />
                          ))}
                      </Form.Select>
                    </div>
                    <FormGroup controlId="mouseLeftFunction">
                      <Form.Label>
                        {i18n("options_mouseLeftFunction")}
                      </Form.Label>
                      <Form.Select
                        name="mouseLeftFunction"
                        value={values.mouseLeftFunction}
                        onChange={onNumberInputChange}
                      >
                        {[
                          "options_none",
                          "options_enterKey",
                          "options_rightKey",
                        ].map((key, index) => (
                          <option key={key} value={index}>
                            {i18n(key)}
                          </option>
                        ))}
                      </Form.Select>
                    </FormGroup>
                    <FormGroup controlId="mouseMiddleFunction">
                      <Form.Label>
                        {i18n("options_mouseMiddleFunction")}
                      </Form.Label>
                      <Form.Select
                        name="mouseMiddleFunction"
                        value={values.mouseMiddleFunction}
                        onChange={onNumberInputChange}
                      >
                        {[
                          "options_none",
                          "options_enterKey",
                          "options_leftKey",
                          "options_doPaste",
                        ].map((key, index) => (
                          <option key={key} value={index}>
                            {i18n(key)}
                          </option>
                        ))}
                      </Form.Select>
                    </FormGroup>
                    <FormGroup controlId="mouseWheelFunction1">
                      <Form.Label>
                        {i18n("options_mouseWheelFunction1")}
                      </Form.Label>
                      <Form.Select
                        name="mouseWheelFunction1"
                        value={values.mouseWheelFunction1}
                        onChange={onNumberInputChange}
                      >
                        {[
                          "options_none",
                          "options_upDown",
                          "options_pageUpDown",
                          "options_threadLastNext",
                        ].map((key, index) => (
                          <option key={key} value={index}>
                            {i18n(key)}
                          </option>
                        ))}
                      </Form.Select>
                    </FormGroup>
                    <FormGroup controlId="mouseWheelFunction2">
                      <Form.Label>
                        {i18n("options_mouseWheelFunction2")}
                      </Form.Label>
                      <Form.Select
                        name="options_mouseWheelFunction2"
                        value={values.options_mouseWheelFunction2}
                        onChange={onNumberInputChange}
                      >
                        {[
                          "options_none",
                          "options_upDown",
                          "options_pageUpDown",
                          "options_threadLastNext",
                        ].map((key, index) => (
                          <option key={key} value={index}>
                            {i18n(key)}
                          </option>
                        ))}
                      </Form.Select>
                    </FormGroup>
                    <FormGroup controlId="mouseWheelFunction3">
                      <Form.Label>
                        {i18n("options_mouseWheelFunction3")}
                      </Form.Label>
                      <Form.Select
                        name="options_mouseWheelFunction3"
                        value={values.options_mouseWheelFunction3}
                        onChange={onNumberInputChange}
                      >
                        {[
                          "options_none",
                          "options_upDown",
                          "options_pageUpDown",
                          "options_threadLastNext",
                        ].map((key, index) => (
                          <option key={key} value={index}>
                            {i18n(key)}
                          </option>
                        ))}
                      </Form.Select>
                    </FormGroup>
                  </fieldset>
                </Tab.Pane>
                <Tab.Pane eventKey="about">
                  <div>
                    <legend>
                      PttChrome
                      <small> - {i18n("about_appName_subtitle")}</small>
                      <button
                        type="button"
                        className="close"
                        onClick={onCloseClick}
                      >
                        &times;
                      </button>
                    </legend>
                    <p>{replaceI18n("about_description", replacements)}</p>
                  </div>
                  <div>
                    <legend>{i18n("about_version_title")}</legend>
                    <ul>
                      <li>
                        {replaceI18n("about_version_current", replacements)}
                      </li>
                      <li>
                        {replaceI18n("about_version_original", replacements)}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <legend>{i18n("about_new_title")}</legend>
                    <ul>
                      {i18n("about_new_content").map((text, index) => (
                        <li key={index}>{text}</li>
                      ))}
                    </ul>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default PrefModal;
