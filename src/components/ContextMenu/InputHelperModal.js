import React, { useState, useCallback } from "react";
import {
  Modal,
  Tab,
  Row,
  Col,
  Nav,
  NavItem,
  NavDropdown,
  Dropdown,
  SplitButton,
} from "react-bootstrap";
import { Form } from "react-bootstrap";
import ColorSpan from "../Row/WordSegmentBuilder/ColorSpan";
import { i18n } from "../../js/i18n";
import "./InputHelperModal.css";

const SYMBOLS = {
  general: [
    "，",
    "、",
    "。",
    "．",
    "？",
    "！",
    "～",
    "＄",
    "％",
    "＠",
    "＆",
    "＃",
    "＊",
    "‧",
    "；",
    "︰",
    "…",
    "‥",
    "﹐",
    "﹒",
    "˙",
    "·",
    "﹔",
    "﹕",
    "‘",
    "’",
    "“",
    "”",
    "〝",
    "〞",
    "‵",
    "′",
    "〃",
  ],

  lineBorders: [
    "├",
    "─",
    "┼",
    "┴",
    "┬",
    "┤",
    "┌",
    "┐",
    "│",
    "▕",
    "└",
    "┘",
    "╭",
    "╮",
    "╰",
    "╯",
    "╔",
    "╦",
    "╗",
    "╠",
    "═",
    "╬",
    "╣",
    "╓",
    "╥",
    "╖",
    "╒",
    "╤",
    "╕",
    "║",
    "╚",
    "╩",
    "╝",
    "╟",
    "╫",
    "╢",
    "╙",
    "╨",
    "╜",
    "╞",
    "╪",
    "╡",
    "╘",
    "╧",
    "╛",
  ],

  blocks: [
    "＿",
    "ˍ",
    "▁",
    "▂",
    "▃",
    "▄",
    "▅",
    "▆",
    "▇",
    "█",
    "▏",
    "▎",
    "▍",
    "▌",
    "▋",
    "▊",
    "▉",
    "◢",
    "◣",
    "◥",
    "◤",
  ],

  lines: [
    "﹣",
    "﹦",
    "≡",
    "｜",
    "∣",
    "∥",
    "–",
    "︱",
    "—",
    "︳",
    "╴",
    "¯",
    "￣",
    "﹉",
    "﹊",
    "﹍",
    "﹎",
    "﹋",
    "﹌",
    "﹏",
    "︴",
    "∕",
    "﹨",
    "╱",
    "╲",
    "／",
    "＼",
  ],

  special: [
    "↑",
    "↓",
    "←",
    "→",
    "↖",
    "↗",
    "↙",
    "↘",
    "㊣",
    "◎",
    "○",
    "●",
    "⊕",
    "⊙",
    "△",
    "▲",
    "☆",
    "★",
    "◇",
    "Æ",
    "□",
    "■",
    "▽",
    "▼",
    "§",
    "￥",
    "〒",
    "￠",
    "￡",
    "※",
    "♀",
    "♂",
  ],

  brackets: [
    "〔",
    "〕",
    "【",
    "】",
    "《",
    "》",
    "（",
    "）",
    "｛",
    "｝",
    "﹙",
    "﹚",
    "『",
    "』",
    "﹛",
    "﹜",
    "﹝",
    "﹞",
    "＜",
    "＞",
    "﹤",
    "﹥",
    "「",
    "」",
    "︵",
    "︶",
    "︷",
    "︸",
    "︹",
    "︺",
    "︻",
    "︼",
    "︽",
    "︾",
    "〈",
    "〉",
    "︿",
    "﹀",
    "﹁",
    "﹂",
    "﹃",
    "﹄",
  ],

  greek: [
    "Α",
    "Β",
    "Γ",
    "Δ",
    "Ε",
    "Ζ",
    "Η",
    "Θ",
    "Ι",
    "Κ",
    "Λ",
    "Μ",
    "Ν",
    "Ξ",
    "Ο",
    "Π",
    "Ρ",
    "Σ",
    "Τ",
    "Υ",
    "Φ",
    "Χ",
    "Ψ",
    "Ω",
    "α",
    "β",
    "γ",
    "δ",
    "ε",
    "ζ",
    "η",
    "θ",
    "ι",
    "κ",
    "λ",
    "μ",
    "ν",
    "ξ",
    "ο",
    "π",
    "ρ",
    "σ",
    "τ",
    "υ",
    "φ",
    "χ",
    "ψ",
    "ω",
  ],

  phonetic: [
    "ㄅ",
    "ㄆ",
    "ㄇ",
    "ㄈ",
    "ㄉ",
    "ㄊ",
    "ㄋ",
    "ㄌ",
    "ㄍ",
    "ㄎ",
    "ㄏ",
    "ㄐ",
    "ㄑ",
    "ㄒ",
    "ㄓ",
    "ㄔ",
    "ㄕ",
    "ㄖ",
    "ㄗ",
    "ㄘ",
    "ㄙ",
    "ㄚ",
    "ㄛ",
    "ㄜ",
    "ㄝ",
    "ㄞ",
    "ㄟ",
    "ㄠ",
    "ㄡ",
    "ㄢ",
    "ㄣ",
    "ㄤ",
    "ㄥ",
    "ㄦ",
    "ㄧ",
    "ㄨ",
    "ㄩ",
    "˙",
    "ˊ",
    "ˇ",
    "ˋ",
  ],

  math: [
    "╳",
    "＋",
    "﹢",
    "－",
    "×",
    "÷",
    "＝",
    "≠",
    "≒",
    "∞",
    "ˇ",
    "±",
    "√",
    "⊥",
    "∠",
    "∟",
    "⊿",
    "㏒",
    "㏑",
    "∫",
    "∮",
    "∵",
    "∴",
    "≦",
    "≧",
    "∩",
    "∪",
  ],

  hiragana: [
    "あ",
    "い",
    "う",
    "え",
    "お",
    "か",
    "き",
    "く",
    "け",
    "こ",
    "さ",
    "し",
    "す",
    "せ",
    "そ",
    "た",
    "ち",
    "つ",
    "て",
    "と",
    "な",
    "に",
    "ぬ",
    "ね",
    "の",
    "は",
    "ひ",
    "ふ",
    "へ",
    "ほ",
    "ま",
    "み",
    "む",
    "め",
    "も",
    "ら",
    "り",
    "る",
    "れ",
    "ろ",
    "が",
    "ぎ",
    "ぐ",
    "げ",
    "ご",
    "ざ",
    "じ",
    "ず",
    "ぜ",
    "ぞ",
    "だ",
    "ぢ",
    "づ",
    "で",
    "ど",
    "ば",
    "び",
    "ぶ",
    "べ",
    "ぼ",
    "ぱ",
    "ぴ",
    "ぷ",
    "ぺ",
    "ぽ",
    "や",
    "ゆ",
    "よ",
    "わ",
    "ん",
    "を",
  ],

  katakana: [
    "ア",
    "イ",
    "ウ",
    "エ",
    "オ",
    "カ",
    "キ",
    "ク",
    "ケ",
    "コ",
    "サ",
    "シ",
    "ス",
    "セ",
    "ソ",
    "タ",
    "チ",
    "ツ",
    "テ",
    "ト",
    "ナ",
    "ニ",
    "ヌ",
    "ネ",
    "ノ",
    "ハ",
    "ヒ",
    "フ",
    "ヘ",
    "ホ",
    "マ",
    "ミ",
    "ム",
    "メ",
    "モ",
    "ラ",
    "リ",
    "ル",
    "レ",
    "ロ",
    "ガ",
    "ギ",
    "グ",
    "ゲ",
    "ゴ",
    "ザ",
    "ジ",
    "ズ",
    "ゼ",
    "ゾ",
    "ダ",
    "ジ",
    "ズ",
    "デ",
    "ド",
    "バ",
    "ビ",
    "ブ",
    "ベ",
    "ボ",
    "パ",
    "ピ",
    "プ",
    "ペ",
    "ポ",
    "ヤ",
    "ユ",
    "ヨ",
    "ワ",
    "ン",
    "ヲ",
  ],
};

const EMOTICONS = {
  angry: [
    "(ノ ゜Д゜)ノ ︵ ═╩════╩═",
    "╯-____-)╯~═╩════╩═~",
    "(╭∩╮\\_/╭∩╮)",
    "( ︶︿︶)_╭∩╮",
    "( ‵□′)───C＜─___-)|||",
    "(￣ε(#￣) #○=(一-一o)",
    "(o一-一)=○# (￣#)3￣)",
    "╰(‵皿′＊)╯",
    "○(#‵︿′ㄨ)○",
    "◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣",
  ],

  meh: [
    "(σ′▽‵)′▽‵)σ 哈哈哈哈～你看看你",
    "( ￣ c￣)y▂ξ",
    "( ′-`)y-～",
    "′_>‵",
    "╮(′～‵〞)╭",
    '╮(﹀_﹀")╭',
    "︿(￣︶￣)︿",
    "..╮(﹋﹏﹌)╭..",
    "╮(╯_╰)╭",
    "╮(╯▽╰)/",
  ],

  sweat: [
    "(－^－)ｄ",
    "(￣￣；)",
    "(￣□￣|||)a",
    "(●；－_－)●",
    "￣▽￣||",
    "╭ ﹀◇﹀〣",
    "ˋ(′_‵||)ˊ",
    "●( ¯▽¯；●",
    "o(＞＜；)o o",
  ],

  happy: [
    "~(￣▽￣)~(＿△＿)~(￣▽￣)~(＿△＿)~(￣▽￣)~",
    "(~^O^~)",
    "(∩_∩)",
    "<(￣︶￣)>",
    "v(￣︶￣)y",
    "﹨(╯▽╰)∕",
    "\\(@^0^@)/",
    "\\(^▽^)/",
    "\\⊙▽⊙/",
  ],

  other: [
    "(．＿．?)",
    "(？o？)",
    "(‧Q‧)",
    "〒△〒",
    "m川@.川m",
    "(¯(∞)¯)",
    "(⊙o⊙)",
    "(≧<>≦)",
    "(☆_☆)",
    'o(‧"‧)o',
  ],
};

function sendColorCommand({ fg, bg, isBlink }, onCmdSend, type) {
  let lightColor = "0;";
  if (fg > 7) {
    fg %= 8;
    lightColor = "1;";
  }
  fg += 30;
  bg += 40;
  let blink = "";
  if (isBlink) {
    blink = "5;";
  }
  let cmd = "\x15[";
  if (type === "foreground") {
    cmd += lightColor + blink + fg + "m";
  } else if (type === "background") {
    cmd += bg + "m";
  } else {
    cmd += lightColor + blink + fg + ";" + bg + "m";
  }
  onCmdSend(cmd);
}

const InputHelperModal = ({ show, onReset, onHide, onCmdSend, onConvSend }) => {
  const [fg, setFg] = useState(7);
  const [bg, setBg] = useState(0);
  const [isBlink, setIsBlink] = useState(false);

  const onColorClick = useCallback((event) => {
    const { dataset } = event.target;
    setFg(parseInt(dataset.fg, 10));
  }, []);

  const onColorContextMenu = useCallback(
    (event) => {
      const { dataset } = event.target;
      event.preventDefault();
      event.stopPropagation();
      setBg("bg" in dataset ? parseInt(dataset.bg, 10) : bg);
    },
    [bg],
  );

  const onBlinkChange = useCallback((event) => {
    setIsBlink(event.target.checked);
  }, []);

  const onSendClick = useCallback(() => {
    sendColorCommand({ fg, bg, isBlink }, onCmdSend);
  }, [fg, bg, isBlink, onCmdSend]);

  const onSendSelect = useCallback(
    (eventKey) => {
      sendColorCommand({ fg, bg, isBlink }, onCmdSend, eventKey);
    },
    [fg, bg, isBlink, onCmdSend],
  );

  const onSymEmoClick = useCallback(
    (event) => {
      onConvSend(event.target.textContent);
    },
    [onConvSend],
  );

  const onMouseDown = useCallback((event) => {
    const { dataset, clientX, clientY } = event.currentTarget;
    dataset.dragActive = true;
    dataset.dragLastX = clientX;
    dataset.dragLastY = clientY;
  }, []);

  const onMouseMove = useCallback((event) => {
    const { dataset, style, clientX, clientY } = event.currentTarget;
    if (dataset.dragActive === "true") {
      window.getSelection().removeAllRanges();
      style.cssText += `
        top:${(parseFloat(style.top) || 0) + clientY - dataset.dragLastY}px;
        left:${(parseFloat(style.left) || 0) + clientX - dataset.dragLastX}px;
      `;
      dataset.dragLastX = clientX;
      dataset.dragLastY = clientY;
    }
  }, []);

  const onMouseUp = useCallback((event) => {
    const { dataset } = event.currentTarget;
    dataset.dragActive = false;
  }, []);

  return (
    <Modal
      show={show}
      backdrop={false}
      className="InputHelperModal__Dialog"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{i18n("inputHelperTitle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="colors">
          <Row className="clearfix">
            <Col sm={12}>
              <Nav bsStyle="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="colors">{i18n("colorTitle")}</Nav.Link>
                </Nav.Item>
                <NavDropdown eventKey="symbols" title={i18n("symTitle")}>
                  {Object.keys(SYMBOLS).map((group) => (
                    <Dropdown.Item key={group} eventKey={`symbols.${group}`}>
                      {i18n(`symTitle_${group}`)}
                    </Dropdown.Item>
                  ))}
                </NavDropdown>
                <NavDropdown eventKey="emoticons" title={i18n("emoTitle")}>
                  {Object.keys(EMOTICONS).map((group) => (
                    <Dropdown.Item key={group} eventKey={`emoticons.${group}`}>
                      {i18n(`emoTitle_${group}`)}
                    </Dropdown.Item>
                  ))}
                </NavDropdown>
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content animation>
                <Tab.Pane eventKey="colors">
                  <Row>
                    <Col xs={12} sm={7}>
                      <ul className="InputHelperModal__ColorList">
                        {[...Array(16).keys()].map((i) => (
                          <li
                            key={i}
                            onClick={onColorClick}
                            onContextMenu={onColorContextMenu}
                            className={`b${i}`}
                            data-fg={i}
                            data-bg={i}
                          />
                        ))}
                      </ul>
                    </Col>
                    <Col xs={12} sm={5}>
                      {i18n("colorHelperTooltip1")}
                      <br />
                      {i18n("colorHelperTooltip2")}
                    </Col>
                  </Row>
                  <div className="InputHelperModal__Preview">
                    <ColorSpan
                      className="InputHelperModal__Preview__Content"
                      colorState={{
                        fg,
                        bg,
                        blink: isBlink,
                      }}
                      inner={i18n("colorHelperPreview")}
                    />
                  </div>
                  <Row>
                    <Col xs={4}>
                      <Form.Check
                        type="checkbox"
                        label={i18n("colorHelperBlink")}
                        checked={isBlink}
                        onChange={onBlinkChange}
                      />
                    </Col>
                    <Col
                      xs={8}
                      className="InputHelperModal__SendButtonContainer"
                    >
                      <SplitButton
                        title={i18n("colorHelperSend")}
                        onClick={onSendClick}
                      >
                        <Dropdown.Item
                          eventKey="foreground"
                          onSelect={onSendSelect}
                        >
                          {i18n("colorHelperSendMenuFore")}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="background"
                          onSelect={onSendSelect}
                        >
                          {i18n("colorHelperSendMenuBack")}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="reset" onSelect={onReset}>
                          {i18n("colorHelperSendMenuReset")}
                        </Dropdown.Item>
                      </SplitButton>
                    </Col>
                  </Row>
                </Tab.Pane>
                {Object.keys(SYMBOLS).map((group) => (
                  <Tab.Pane key={group} eventKey={`symbols.${group}`}>
                    <ul className="InputHelperModal__SymbolList">
                      {SYMBOLS[group].map((it, index) => (
                        <li key={index} onClick={onSymEmoClick}>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </Tab.Pane>
                ))}
                {Object.keys(EMOTICONS).map((group) => (
                  <Tab.Pane key={group} eventKey={`emoticons.${group}`}>
                    <ul className="InputHelperModal__EmoticonList">
                      {EMOTICONS[group].map((it, index) => (
                        <li key={index} onClick={onSymEmoClick}>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default InputHelperModal;
