import $ from "jquery";
import cx from "classnames";
import React, { useState, useEffect, useCallback } from "react";
import DropdownMenu from "./DropdownMenu";
import InputHelperModal from "./InputHelperModal";
import LiveHelperModal from "./LiveHelperModal";
import PrefModal from "./PrefModal";

function noop() {}

const EVENT_KEY_BY_HOT_KEY = {
  ["C".charCodeAt(0)]: "copy",
  ["E".charCodeAt(0)]: "copyLinkUrl",
  ["P".charCodeAt(0)]: "paste",
  ["S".charCodeAt(0)]: "searchGoogle",
  ["T".charCodeAt(0)]: "openUrlNewTab",
};

const menuHandlerByEventKey = {
  copy: (pttchrome, { selectedText }) => pttchrome.doCopy(selectedText),
  copyAnsi: (pttchrome) => pttchrome.doCopyAnsi(),
  paste: (pttchrome) => pttchrome.doPaste(),
  searchGoogle: (pttchrome, { selectedText }) =>
    pttchrome.doSearchGoogle(selectedText),
  openUrlNewTab: (pttchrome, { aElement }) =>
    pttchrome.doOpenUrlNewTab(aElement),
  copyLinkUrl: (pttchrome, { contextOnUrl }) => pttchrome.doCopy(contextOnUrl),
  selectAll: (pttchrome) => pttchrome.doSelectAll(),
  mouseBrowsing: (pttchrome) => pttchrome.switchMouseBrowsing(),
};

const initialState = {
  // --- Menu state ---
  open: false,
  pageX: 0,
  pageY: 0,
  contextOnUrl: "",
  aElement: undefined,
  selectedText: "",
  urlEnabled: false,
  normalEnabled: false,
  selEnabled: false,
  // --- Modal state ---
  showsInputHelper: false,
  showsLiveArticleHelper: false,
  showsSettings: false,
  // --- LiveHelper state ---
  liveHelperEnabled: false,
  liveHelperSec: 1,
};

const ContextMenu = ({ pttchrome }) => {
  const [state, setState] = useState(initialState);

  const onContextMenu = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      const { CmdHandler } = pttchrome;
      const doDOMMouseScroll =
        CmdHandler.getAttribute("doDOMMouseScroll") === "1";
      if (doDOMMouseScroll) {
        CmdHandler.setAttribute("doDOMMouseScroll", "0");
        return;
      }
      pttchrome.contextMenuShown = true;
      // just in case the selection get de-selected
      if (window.getSelection().isCollapsed) {
        pttchrome.lastSelection = null;
      } else {
        pttchrome.lastSelection = pttchrome.view.getSelectionColRow();
      }

      const target = $(event.target);
      let contextOnUrl = "";
      let aElement;
      if (target.is("a")) {
        contextOnUrl = target.attr("href");
        aElement = target[0];
      } else if (target.parent().is("a")) {
        contextOnUrl = target.parent().attr("href");
        aElement = target[0].parentNode;
      }

      const selectedText = window
        .getSelection()
        .toString()
        .replace(/\u00a0/g, " ");
      const urlEnabled = !!contextOnUrl;
      const normalEnabled = !urlEnabled && window.getSelection().isCollapsed;
      const selEnabled = !normalEnabled;

      setState({
        ...state,
        open: true,
        pageX: event.pageX,
        pageY: event.pageY,
        contextOnUrl,
        aElement,
        selectedText,
        urlEnabled,
        normalEnabled,
        selEnabled,
      });
    },
    [pttchrome, state],
  );

  const onHide = useCallback(() => {
    if (state.open) {
      pttchrome.contextMenuShown = false;
      setState(initialState);
    }
  }, [pttchrome, state.open]);

  const onMenuSelect = useCallback(
    (eventKey, event) => {
      menuHandlerByEventKey[eventKey](pttchrome, state);
      event.stopPropagation();
      pttchrome.contextMenuShown = false;
      setState(initialState);
    },
    [pttchrome, state],
  );

  const onInputHelperClick = useCallback(
    (event) => {
      event.stopPropagation();
      pttchrome.contextMenuShown = false;
      setState({
        ...initialState,
        showsInputHelper: true,
      });
    },
    [pttchrome],
  );

  const onLiveArticleHelperClick = useCallback(
    (event) => {
      event.stopPropagation();
      pttchrome.contextMenuShown = false;
      setState({
        ...initialState,
        showsLiveArticleHelper: true,
      });
    },
    [pttchrome],
  );

  const onSettingsClick = useCallback(
    (event) => {
      event.stopPropagation();
      pttchrome.contextMenuShown = false;
      pttchrome.onDisableLiveHelperModalState();
      pttchrome.modalShown = true;
      setState({
        ...initialState,
        showsSettings: true,
      });
    },
    [pttchrome],
  );

  const onInputHelperHide = useCallback(() => {
    setState({
      ...state,
      showsInputHelper: false,
    });
  }, [state]);

  const onInputHelperReset = useCallback(() => {
    pttchrome.conn.send("\x15[m");
  }, [pttchrome]);

  const onInputHelperCmdSend = useCallback(
    (cmd) => {
      if (!window.getSelection().isCollapsed && pttchrome.buf.pageState == 6) {
        // something selected
        var sel = pttchrome.view.getSelectionColRow();
        var y = pttchrome.buf.cur_y;
        var selCmd = "";
        // move cursor to end and send reset code
        selCmd += "\x1b[H";
        if (y > sel.end.row) {
          selCmd += "\x1b[A".repeat(y - sel.end.row);
        } else if (y < sel.end.row) {
          selCmd += "\x1b[B".repeat(sel.end.row - y);
        }
        var repeats = pttchrome.buf.getRowText(
          sel.end.row,
          0,
          sel.end.col,
        ).length;
        selCmd += "\x1b[C".repeat(repeats) + "\x15[m";

        // move cursor to start and send color code
        y = sel.end.row;
        selCmd += "\x1b[H";
        if (y > sel.start.row) {
          selCmd += "\x1b[A".repeat(y - sel.start.row);
        } else if (y < sel.start.row) {
          selCmd += "\x1b[B".repeat(sel.start.row - y);
        }
        repeats = pttchrome.buf.getRowText(
          sel.start.row,
          0,
          sel.start.col,
        ).length;
        selCmd += "\x1b[C".repeat(repeats);
        cmd = selCmd + cmd;
      }
      pttchrome.conn.send(cmd);
    },
    [pttchrome],
  );

  const onInputHelperConvSend = useCallback(
    (value) => {
      pttchrome.conn.convSend(value);
    },
    [pttchrome],
  );

  const onLiveHelperHide = useCallback(() => {
    pttchrome.setAutoPushthreadUpdate(-1);
    setState({
      ...state,
      showsLiveArticleHelper: false,
      liveHelperEnabled: false,
    });
  }, [pttchrome, state]);

  const onLiveHelperChange = useCallback(
    (nextState) => {
      if (nextState.enabled) {
        // cancel easy reading mode first
        pttchrome.view.useEasyReadingMode = false;
        pttchrome.switchToEasyReadingMode();
        pttchrome.setAutoPushthreadUpdate(nextState.sec);
      } else {
        pttchrome.setAutoPushthreadUpdate(-1);
      }
      setState({
        ...state,
        liveHelperEnabled: nextState.enabled,
        liveHelperSec: nextState.sec,
      });
    },
    [pttchrome, state],
  );

  const onPrefSave = useCallback(
    (values) => {
      pttchrome.onValuesPrefChange(values);
      pttchrome.modalShown = false;
      pttchrome.setInputAreaFocus();
      pttchrome.switchToEasyReadingMode(pttchrome.view.useEasyReadingMode);
      setState({
        ...state,
        showsSettings: false,
      });
    },
    [pttchrome, state],
  );

  const onPrefReset = useCallback(
    (values) => {
      pttchrome.view.redraw(true);
      pttchrome.onValuesPrefChange(values);
      pttchrome.modalShown = false;
      pttchrome.setInputAreaFocus();
      pttchrome.switchToEasyReadingMode(pttchrome.view.useEasyReadingMode);
      setState({
        ...state,
        showsSettings: false,
      });
    },
    [pttchrome, state],
  );

  useEffect(() => {
    if (state.liveHelperEnabled) {
      pttchrome.onToggleLiveHelperModalState = () => {
        onLiveHelperChange({
          enabled: !state.liveHelperEnabled,
          sec: state.liveHelperSec,
        });
      };
      pttchrome.onDisableLiveHelperModalState = () => {
        onLiveHelperChange({
          enabled: false,
          sec: state.liveHelperSec,
        });
      };
    } else {
      pttchrome.onToggleLiveHelperModalState =
        pttchrome.onDisableLiveHelperModalState = noop;
    }
  }, [
    pttchrome,
    state.liveHelperEnabled,
    state.liveHelperSec,
    onLiveHelperChange,
  ]);

  useEffect(() => {
    const contextMenuHandler = (event) => {
      onContextMenu(event);
    };
    document
      .getElementById("BBSWindow")
      .addEventListener("contextmenu", contextMenuHandler, true);

    const clickHandler = () => {
      onHide();
    };
    window.addEventListener("click", clickHandler, false);

    const touchStartHandler = (event) => {
      if (event.target.getAttribute("role") === "menuitem") {
        return;
      }
      onHide();
    };
    window.addEventListener("touchstart", touchStartHandler, false);

    const hotKeyUpHandler = (event) => {
      if (!state.open) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.altKey || event.ctrlKey || event.shiftKey) {
        return;
      }
      const eventKey = EVENT_KEY_BY_HOT_KEY[event.keyCode];
      if (eventKey) {
        onMenuSelect(eventKey, event);
      }
    };
    window.addEventListener("keyup", hotKeyUpHandler, false);

    return () => {
      window.removeEventListener("keyup", hotKeyUpHandler, false);
      window.removeEventListener("touchstart", touchStartHandler, false);
      window.removeEventListener("click", clickHandler, false);
      document
        .getElementById("BBSWindow")
        .removeEventListener("contextmenu", contextMenuHandler, false);
    };
  }, [onContextMenu, onHide, onMenuSelect, state.open]);

  return (
    <React.Fragment>
      <DropdownMenu
        show={state.open}
        pageX={state.pageX}
        pageY={state.pageY}
        urlEnabled={state.urlEnabled}
        normalEnabled={state.normalEnabled}
        selEnabled={state.selEnabled}
        mouseBrowsingEnabled={pttchrome.buf.useMouseBrowsing}
        selectedText={state.selectedText}
        onMenuSelect={onMenuSelect}
        onInputHelperClick={onInputHelperClick}
        onLiveArticleHelperClick={onLiveArticleHelperClick}
        onSettingsClick={onSettingsClick}
      />
      <InputHelperModal
        show={state.showsInputHelper}
        onHide={onInputHelperHide}
        onReset={onInputHelperReset}
        onCmdSend={onInputHelperCmdSend}
        onConvSend={onInputHelperConvSend}
      />
      <LiveHelperModal
        show={state.showsLiveArticleHelper}
        onHide={onLiveHelperHide}
        enabled={state.liveHelperEnabled}
        sec={state.liveHelperSec}
        onChange={onLiveHelperChange}
      />
      <PrefModal
        show={state.showsSettings}
        onSave={onPrefSave}
        onReset={onPrefReset}
      />
    </React.Fragment>
  );
};

export default ContextMenu;
