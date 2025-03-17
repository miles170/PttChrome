import cx from "classnames";
import React, { useEffect, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { i18n } from "../../js/i18n";
import "./DropdownMenu.css";

const top = (mouseHeight, menuHeight) => {
  const pageHeight = window.innerHeight;

  // opening menu would pass the bottom of the page
  if (mouseHeight + menuHeight > pageHeight && menuHeight < mouseHeight) {
    return mouseHeight - menuHeight;
  }
  return mouseHeight;
};

const left = (mouseWidth, menuWidth) => {
  const pageWidth = window.innerWidth;

  // opening menu would pass the side of the page
  if (mouseWidth + menuWidth > pageWidth && menuWidth < mouseWidth) {
    return mouseWidth - menuWidth;
  }
  return mouseWidth;
};

const normalizeSelectedText = (selectedText) => {
  if (selectedText.length > 15) {
    return `${selectedText.substr(0, 15)} …`;
  }
  return selectedText;
};

const QUICK_SEARCH = {
  providers: [
    {
      name: "goo.gl",
      url: "https://goo.gl/%s",
    },
  ],
};

const DropdownMenu = ({
  show,
  pageX,
  pageY,
  urlEnabled,
  normalEnabled,
  selEnabled,
  mouseBrowsingEnabled,
  selectedText,
  onMenuSelect,
  onInputHelperClick,
  onLiveArticleHelperClick,
  onSettingsClick,
}) => {
  const dropdownMenuRef = useRef(null);

  useEffect(() => {
    const updateMenuPosition = () => {
      if (dropdownMenuRef.current) {
        dropdownMenuRef.current.style.cssText += `
          top:${top(pageY, dropdownMenuRef.current.clientHeight)}px;
          left:${left(pageX, dropdownMenuRef.current.clientWidth)}px;
        `;
      }
    };

    updateMenuPosition();
  }, [pageX, pageY]);

  const handleContextMenu = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <Dropdown
      show={show}
      onSelect={onMenuSelect}
      className="dropdown-menu DropdownMenu--reset"
      ref={dropdownMenuRef}
      onContextMenu={handleContextMenu}
    >
      {selEnabled && (
        <React.Fragment>
          <Dropdown.Item eventKey="copy">
            {i18n("cmenu_copy")}
            <span className="DropdownMenu__Item__HotKey">Ctrl+C</span>
          </Dropdown.Item>
          <Dropdown.Item eventKey="copyAnsi">
            {i18n("cmenu_copyAnsi")}
          </Dropdown.Item>
        </React.Fragment>
      )}
      {normalEnabled && (
        <Dropdown.Item eventKey="paste">
          {i18n("cmenu_paste")}
          <span className="DropdownMenu__Item__HotKey">Shift+Insert</span>
        </Dropdown.Item>
      )}
      {selEnabled && (
        <Dropdown.Item eventKey="searchGoogle">
          {i18n("cmenu_searchGoogle")}{" "}
          <span>'{normalizeSelectedText(selectedText)}'</span>
        </Dropdown.Item>
      )}
      {urlEnabled && (
        <React.Fragment>
          <Dropdown.Item eventKey="openUrlNewTab">
            {i18n("cmenu_openUrlNewTab")}
          </Dropdown.Item>
          <Dropdown.Item eventKey="copyLinkUrl">
            {i18n("cmenu_copyLinkUrl")}
          </Dropdown.Item>
        </React.Fragment>
      )}
      <Dropdown.Divider />
      {normalEnabled && (
        <React.Fragment>
          <Dropdown.Item eventKey="selectAll">
            {i18n("cmenu_selectAll")}
            <span className="DropdownMenu__Item__HotKey">Ctrl+A</span>
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="mouseBrowsing"
            className={cx({
              "DropdownMenu__Item--checked": mouseBrowsingEnabled,
            })}
          >
            {i18n("cmenu_mouseBrowsing")}
          </Dropdown.Item>
          <Dropdown.Item onClick={onInputHelperClick}>
            {i18n("cmenu_showInputHelper")}
          </Dropdown.Item>
          <Dropdown.Item onClick={onLiveArticleHelperClick}>
            {i18n("cmenu_showLiveArticleHelper")}
          </Dropdown.Item>
          <Dropdown.Divider />
        </React.Fragment>
      )}
      <Dropdown.Item onClick={onSettingsClick}>
        {i18n("cmenu_settings")}
      </Dropdown.Item>
    </Dropdown>
  );
};

export default DropdownMenu;
